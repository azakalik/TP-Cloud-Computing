type AuctionDetailType = {
   id: string;
   imageUrls: string[];
   title: string;
   description: string;
   countryFlag: string;
   initialPrice: number;
   highestBid: number;
   initialTime: string;
   endTime: string;
 }

 export default AuctionDetailType;