import axios from 'axios';
import https from 'https';

const instance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

function query(queryString, accessToken) {
  const configs = {};
  if (accessToken) {
    configs.headers = {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return instance.post('https://apis.lynlab.co.kr/graphql', `query{${queryString}}`, configs)
    .then((res) => {
      if (res.data.errors) {
        throw new Error('Query error');
      }
      return res.data.data;
    });
}

function mutation(queryString, accessToken) {
  const configs = {};
  if (accessToken) {
    configs.headers = {
      Authorization: `Bearer ${accessToken}`,
    };
  }

  return instance.post('https://apis.lynlab.co.kr/graphql', `mutation{${queryString}}`, configs)
    .then((res) => {
      if (res.data.errors) {
        throw new Error('Mutation error');
      }
      return res.data.data;
    });
}

export { query, mutation };
