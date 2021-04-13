import { wrapper } from '../redux/store';

const App = ({ Component, pageProps }) => <Component {...pageProps} />;

export default wrapper.withRedux(App);
