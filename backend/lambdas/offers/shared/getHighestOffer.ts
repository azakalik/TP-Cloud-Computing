import { Client } from "pg";

type PgResponse = {
    offer_id: string;
    publication_id: string;
    user_id: string;
    price: string;
    time: string;
}

export type AuctionOffer = {
    offer_id: string;
    publication_id: string;
    user_id: string;
    price: number;
    time: string;
}

export const getHighestOffer = async (client: Client, publicationId: string): Promise<AuctionOffer | null> => {
    const highestOfferResult = await client.query<PgResponse>(
        `SELECT *
        FROM offers
        WHERE publication_id = $1
        ORDER BY price DESC
        LIMIT 1;`,
        [publicationId]
    );

    const result = highestOfferResult.rows.length > 0 ? highestOfferResult.rows[0] : null;

    return result ? {
        offer_id: result.offer_id,
        publication_id: result.publication_id,
        user_id: result.user_id,
        price: parseFloat(result.price),
        time: result.time
    } : null;
}