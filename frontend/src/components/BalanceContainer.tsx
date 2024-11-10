import { Flex, Group, NumberFormatter, Text } from "@mantine/core";
import { IconCoin } from "@tabler/icons-react";
import useUserBalanceStore from "../stores/useBalanceStore";

const MoneyText = ({ label, amount }: { label: string; amount: number }) => (
    <Flex justify="center" align="stretch" direction="row" gap={5}>
        <Flex align="center" justify="center">
            <Text size="xs" fw={700}>{label}</Text>
            <Text size="xs">:</Text>
        </Flex>
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
    </Flex>
);



export function BalanceContainer() {
    const { balance } = useUserBalanceStore();

    return (
        <Group gap="xs">
            <IconCoin size={24} color="#0cb05e" />
            <Flex justify="center" align="flex-start" direction="column">
                <MoneyText label="Total" amount={balance.total} />
                <MoneyText label="Available" amount={balance.available} />
            </Flex>
        </Group> 
    )
}