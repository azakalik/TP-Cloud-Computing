
# Cognito User Pool
resource "aws_cognito_user_pool" "ez_auction_user_pool" {
  name = "ez-auction-user-pool"

  # Allow users to sign in with their email address
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  password_policy {
    minimum_length    = 8
    require_uppercase = false
    require_lowercase = false
    require_numbers   = false
    require_symbols   = false
  }

  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_message        = "Your verification code is {####}"
    email_subject        = "Verify your email for eZAuction"
  }
}

# Cognito User Pool App Client (No Hosted UI)
resource "aws_cognito_user_pool_client" "ez_auction_pool_client" {
  user_pool_id = aws_cognito_user_pool.ez_auction_user_pool.id
  name         = "ez-auction-client"

  # Do not generate a client secret for public apps (e.g., single-page apps)
  generate_secret = false

  # Enable SRP (Secure Remote Password) protocol for authentication
  explicit_auth_flows = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"]

  prevent_user_existence_errors = "ENABLED"
}