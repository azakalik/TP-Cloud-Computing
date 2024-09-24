type NewAuctionType = {
  user: string;
  images: string[]; // base64 encoded images
  title: string;
  description: string;
  countryFlag: string;
  initialPrice: number;
  initialTime: string;
  endTime: string;
};

export default NewAuctionType;
