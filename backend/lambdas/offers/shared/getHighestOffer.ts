import { Client } from "pg";

export type AuctionOffer = {
    offer_id: string;
    publication_id: string;
    user_id: string;
    price: number;
    time: string;
}

export const getHighestOffer = async (client: Client, publicationId: string): Promise<AuctionOffer | null> => {
    const highestOfferResult = await client.query<AuctionOffer>(
        `SELECT *
        FROM offers
        WHERE publication_id = $1
        ORDER BY price DESC
        LIMIT 1;`,
        [publicationId]
    );

    return highestOfferResult.rows.length > 0 ? highestOfferResult.rows[0] : null;
}