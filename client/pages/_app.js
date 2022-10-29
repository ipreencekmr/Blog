import buildClient from '../api/build-client';
import Header from '../components/header';
import 'bootstrap/dist/css/bootstrap.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Profile from '../components/profile';

const AppComponent = ({ Component, pageProps, currentUser }) => {
    return <Container>
        <Header currentUser={currentUser} />
        <hr></hr>
        <Container>
            <Row>
                {
                    currentUser && <Col lg={2} md={4} sm={12}>
                        <h1>Profile</h1>
                        <Profile
                            currentUser={currentUser} />
                    </Col>
                }
                <Col lg={10} md={8} sm={12}>
                    <Component
                        currentUser={currentUser}
                        {...pageProps}
                    />
                </Col>
            </Row>
        </Container>
    </Container>
}

AppComponent.getInitialProps = async (appContext) => {

    const client = buildClient(appContext.ctx);
    const { data } = await client.get('/api/users/currentuser');

    let pageProps = {};

    if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(
            appContext.ctx,
            client,
            data.currentUser
        );
    }

    return {
        pageProps,
        currentUser: data.currentUser
    };
}

export default AppComponent;