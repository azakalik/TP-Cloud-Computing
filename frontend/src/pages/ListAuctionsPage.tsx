import { Auth } from 'aws-amplify';
import BidsContainer from '../components/BidsContainer';
import useBidStore from '../stores/useBidStore';
import { useEffect } from 'react';

const ListAuctionsPage = () => {
  const { fetchAuctions, auctions } = useBidStore();




  useEffect(() => {

    (async () => {

      // Get the current session, which contains the JWT token
    const session = await Auth.currentSession();

    // Extract the ID token (JWT)
    const idToken = session.getIdToken().getJwtToken();

    console.log('JWT Token:', idToken);

    })()
    fetchAuctions(); // Fetch bids when the component mounts
  }, [fetchAuctions]);
  return (
    <div>
      <BidsContainer pageTitle='Available Auctions' auctions={auctions} />
    </div>
  );
};

export default ListAuctionsPage;
