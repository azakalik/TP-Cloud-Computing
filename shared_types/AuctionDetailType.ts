type AuctionDetailType = {
  id: string;
  user: string;
  imageUrls: string[];
  title: string;
  description: string;
  countryFlag: string;
  initialPrice: number;
  initialTime: string;
  endTime: string;
};

export default AuctionDetailType;
