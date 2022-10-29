
import Link from 'next/link';
import Nav from 'react-bootstrap/Nav';

export default ({ currentUser }) => {

    const links = [
        !currentUser && {
            label: 'Sign Up',
            href: '/auth/signup'
        },
        !currentUser && {
            label: 'Sign In',
            href: '/auth/signin'
        },
        currentUser && {
            label: 'Create Post',
            href: '/posts/new'
        },
        currentUser && {
            label: 'My Posts',
            href: '/posts/myposts'
        },
        currentUser && {
            label: 'Sign Out',
            href: '/auth/signout'
        }
    ].filter(linkConfig => linkConfig)
        .map(({ label, href }) => {
            return <Nav.Item key={href}>
                <Link href={href}>
                    <a className="nav-link">{label}</a>
                </Link>
            </Nav.Item>
        });

    return <Nav
        activeKey="/"
        className="justify-content-between">
        <Nav.Item >
            <Link href="/">
                <a className="nav-link">Home</a>
            </Link>
        </Nav.Item>
        <span className="d-flex justify-content-end">
            {links}
        </span>
    </Nav>
};