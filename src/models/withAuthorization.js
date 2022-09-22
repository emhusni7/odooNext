import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const Loader = dynamic(() => import('../components/loader'), {
  ssr: false,
});

const withAuthorization = (Component) => (props) => {
  const [user, setUser] = useState('');
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('uid');

    if (!username) {
      router.push('/login');
    } else {
      setUser(username);
    }
  });

  if (!user) {
    return (
      <>
        <Loader />
      </>
    );
  }
  return <Component {...props} />;
};

export default withAuthorization;
