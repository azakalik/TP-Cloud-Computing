import BidsContainer from '../components/BidsContainer';
import useBidStore from '../stores/useBidStore';
import { useEffect } from 'react';

const ListAuctionsPage = () => {
  const { fetchAuctions, auctions } = useBidStore();

  useEffect(() => {
    fetchAuctions(); // Fetch bids when the component mounts
  }, [fetchAuctions]);
  return (
    <div>
      <BidsContainer pageTitle='Available Auctions' auctions={auctions} />
    </div>
  );
};

export default ListAuctionsPage;
