resource "aws_db_subnet_group" "rds_subnet_group" {
    depends_on = [ module.vpc ]
    name = "ezauction-rds-subnet-group"
    description = "Subnet group for RDS instances"
    subnet_ids = local.rds_subnets
}

resource "aws_db_instance" "rds_instance_primary" {
    depends_on = [ aws_db_subnet_group.rds_subnet_group ]
    identifier = "ezauction-rds-db-primary"
    engine = "postgres"
    engine_version = "16.3"
    engine_lifecycle_support = "open-source-rds-extended-support-disabled"
    username = var.rds_username
    password = var.rds_password
    instance_class = "db.t3.micro"
    storage_type = "gp3"
    allocated_storage = 20
    max_allocated_storage = 1000
    db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
    publicly_accessible = false
    vpc_security_group_ids = [ module.sg_rds.security_group_id ]
    performance_insights_enabled = false
    db_name = var.rds_db_name
    backup_retention_period = 1
    backup_window = "06:00-09:00"
    storage_encrypted = true
    enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
    auto_minor_version_upgrade = true
    maintenance_window = "Sun:09:00-Sun:11:00"
    deletion_protection = false
    multi_az = true
    skip_final_snapshot = true
}

resource "aws_db_instance" "rds_instance_replica" {
    depends_on = [ aws_db_instance.rds_instance_primary ]
    replicate_source_db = aws_db_instance.rds_instance_primary.identifier
    identifier = "ezauction-rds-db-replica"
    availability_zone = join("", [var.aws_region, "b"])
    instance_class = aws_db_instance.rds_instance_primary.instance_class
    multi_az = false
    skip_final_snapshot = true
    storage_encrypted = true
    vpc_security_group_ids = aws_db_instance.rds_instance_primary.vpc_security_group_ids
    # db_subnet_group_name = aws_db_subnet_group.rds_subnet_group.name
    publicly_accessible = aws_db_instance.rds_instance_primary.publicly_accessible
    backup_retention_period = aws_db_instance.rds_instance_primary.backup_retention_period
    backup_window = aws_db_instance.rds_instance_primary.backup_window
    performance_insights_enabled = aws_db_instance.rds_instance_primary.performance_insights_enabled
    storage_type = aws_db_instance.rds_instance_primary.storage_type
    # allocated_storage = aws_db_instance.rds_instance_primary.allocated_storage
    max_allocated_storage = aws_db_instance.rds_instance_primary.max_allocated_storage
    engine = aws_db_instance.rds_instance_primary.engine
    engine_version = aws_db_instance.rds_instance_primary.engine_version
    engine_lifecycle_support = aws_db_instance.rds_instance_primary.engine_lifecycle_support
    enabled_cloudwatch_logs_exports = aws_db_instance.rds_instance_primary.enabled_cloudwatch_logs_exports
    auto_minor_version_upgrade = aws_db_instance.rds_instance_primary.auto_minor_version_upgrade
    maintenance_window = aws_db_instance.rds_instance_primary.maintenance_window
    deletion_protection = aws_db_instance.rds_instance_primary.deletion_protection
}

resource "aws_db_proxy" "rds_proxy" {
    depends_on = [ aws_secretsmanager_secret_version.secret_rds_credentials_version, data.aws_iam_role.iam_role_labrole ]
    name = "ezauction-rds-proxy"
    idle_client_timeout = 5 * 60
    engine_family = "POSTGRESQL"
    role_arn = data.aws_iam_role.iam_role_labrole.arn

    auth {
        iam_auth = "DISABLED"
        auth_scheme = "SECRETS"
        secret_arn = aws_secretsmanager_secret.secret_rds_credentials.arn
    }

    require_tls = true
    vpc_subnet_ids = local.rds_subnets
    vpc_security_group_ids = [ module.sg_rds_proxy.security_group_id ]  
}

resource "aws_db_proxy_default_target_group" "rds_proxy_default_target_group" {
    depends_on = [ aws_db_proxy.rds_proxy ]
    db_proxy_name = aws_db_proxy.rds_proxy.name
    connection_pool_config {
        max_connections_percent = 100
        connection_borrow_timeout = 2 * 60
    }
  
}

resource "aws_db_proxy_target" "rds_proxy_target_primary" {
    depends_on = [ aws_db_proxy.rds_proxy, aws_db_instance.rds_instance_primary ]
    db_proxy_name = aws_db_proxy.rds_proxy.name
    target_group_name = aws_db_proxy_default_target_group.rds_proxy_default_target_group.name
    db_instance_identifier = aws_db_instance.rds_instance_primary.identifier  
}