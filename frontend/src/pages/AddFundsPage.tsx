import { useState } from "react";
import { addFunds } from "../api";
import useUserBalanceStore from "../stores/useBalanceStore";
import { Button, Flex, Modal, NumberInput, Paper, Stack, Title } from "@mantine/core";

const ResponseModal = ({showModal, onClose, error}: {showModal: boolean, onClose: () => void, error: string}) => {
    const title = !error ? 'Funds added successfully' : 'An error occurred';
    const body = !error ? 'Funds have been added to your account' : error;
    return (
        <Modal opened={showModal} onClose={onClose} title={title}>
            {body}
        </Modal>
    )
}

const AddFundsPage = () => {
    const {setBalance} = useUserBalanceStore();
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleAddFunds = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        if (amount <= 0) {
            setError('Amount must be positive');
        } else {
            const response = await addFunds(amount);

            if ("error" in response) {
                setError(response.error);
            } else {
                setError('');
                setBalance(response);
                setAmount(0);
            }
        }

        setShowModal(true);
        setLoading(false);
    }

    return (
        <>
            <Flex justify="center" align="center" direction="column">
                <Title mb={10}>Add funds</Title>
                <Paper w="60%" shadow="md" p="lg" mb="lg" withBorder>
                    <form onSubmit={handleAddFunds}>
                        <Stack>
                            <NumberInput
                                value={amount}
                                onChange={(value) => setAmount(+value)}
                                placeholder="Amount to add"
                                label="Amount"
                                required
                                allowNegative={false}
                                allowDecimal={true}
                                decimalScale={2}
                                decimalSeparator="."
                                thousandSeparator=","
                                prefix="$"
                                min={0}
                            />
                            <Button type="submit" loading={loading} disabled={loading} mt="md">
                                Add funds
                            </Button>
                        </Stack>
                    </form>
                </Paper>
            </Flex>   
            
            <ResponseModal showModal={showModal} onClose={() => setShowModal(false)} error={error} />
        </>
    )
}

export default AddFundsPage;
    
    
    