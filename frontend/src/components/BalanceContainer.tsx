import { Flex, Group, Loader, NumberFormatter, Text } from "@mantine/core";
import { IconCoin } from "@tabler/icons-react";
import useUserBalanceStore from "../stores/useBalanceStore";

const MoneyText = ({ label, amount, loading }: { label: string; amount: number, loading: boolean }) => (
    <Flex justify="center" align="stretch" direction="row" gap={5}>
        <Flex align="center" justify="center">
            <Text size="xs" fw={700}>{label}</Text>
            <Text size="xs">:</Text>
        </Flex>
        {loading ? (
            <Loader size={12} color="gray" />
        ) : (
            <Text size="xs"> 
                <NumberFormatter 
                    value={amount} 
                    prefix="$"
                    allowNegative={false}
                    decimalScale={2}
                    decimalSeparator="."
                    thousandSeparator=","
                />
            </Text>
        )}
    </Flex>
);



export function BalanceContainer() {
    const { balance, loading } = useUserBalanceStore();

    return (
        <Group gap="xs">
            <IconCoin size={24} color="#0cb05e" />
            <Flex justify="center" align="flex-start" direction="column">
                <MoneyText label="Total" amount={balance.total} loading={loading} />
                <MoneyText label="Available" amount={balance.available} loading={loading} />
            </Flex>
        </Group> 
    )
}