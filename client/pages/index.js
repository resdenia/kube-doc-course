// import buildClient from '../api/build-client';
// import axios from 'axios';
import Link from 'next/link';
const LandinPage = ({ currentUser, tickets }) => {
  //this is will work only from browser but not for between containers/clusters
  // axios.get('/api/users/currentuser');
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a className="link">Ticket View</a>
          </Link>
        </td>
      </tr>
    );
  });
  console.log(tickets);
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};
//while it is attempting to render our application on the server get initial props is our opertunity to attend to fetch some
// data that this component needs during these server side rendering process
//plain function problem is that it's won't work cause we are using kubernetes
LandinPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };

  // const client = buildClient(context);
  // console.log('LANDING PAGE');

  // const { data } = await client.get('/api/users/currentuser');
  // return data;

  //we close it code case we added helper
  // //=> 'req' it's same what we can get access in express
  // // we checking if window cause we have two types of axios requests internal and external(to ingress-nginx)
  // if (typeof window === 'undefined') {
  //   console.log('window available to ');
  //   //we are on the server!
  //   //requests should be made to http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/currentuser
  //   const { data } = await axios.get(
  //     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
  //     {
  //       headers: req.headers,
  //     }
  //   ); // distructure

  //   return data;
  // } else {
  //   //we are on the browser
  //   //requests can be made with a base url of ''
  //   const { data } = await axios.get('/api/users/currentuser'); // distructure

  //   return data;
  // }
  // console.log('I am on the server!');
  // //http://ingress-nginx.ingress-nginx-controller.svc.cluster.local/api/users/currentuser but we convert it to
  // // const response = await axios.get('/api/users/currentuser');

  // return {};
};

export default LandinPage;
