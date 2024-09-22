import BidsContainer from '../components/BidsContainer';
import useBidStore from '../stores/useBidStore';
import { useEffect } from 'react';

const MyAuctionsPage = () => {
  const { fetchUserAuctions, userAuctions } = useBidStore();

  useEffect(() => {
    fetchUserAuctions()
  }, [fetchUserAuctions]);
  return (
    <div>
      <BidsContainer pageTitle="My Auctions" auctions={userAuctions} />
    </div>
  );
};

export default MyAuctionsPage;
