import React from 'react';
import { connect } from 'react-redux';
import { State } from '../../store';
import { signOutAction } from '../../actions';
import { Redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import './Header.css';

interface HeaderProps {
    isLogged: boolean;
    logout(): void;
    isAdmin: boolean;
}

class _Header extends React.Component<HeaderProps> {
    render() {
        const { logout, isLogged, isAdmin } = this.props;

        if (!isLogged) {
            return <Redirect to="/login" />
        }

        return (
            <div>
                <h1>Welcome!, we hope you'll find a vacation to your liking :)</h1>
                <header className="header">
                    {isAdmin ? <Link to='/adminchart'><Button variant='warning'>Vacations Chart</Button></Link> : null}
                    {isLogged ? <Button variant="danger" onClick={logout}>LOG OUT</Button> : null}
                </header>
            </div>
        )
    }
}

const mapStateToProps = (state: State) => ({
    isLogged: state.isLoggedIn,
    isAdmin: state.isAdmin,
});

const mapDispatchToProps = (dispatch: any) => ({
    logout: () => dispatch(signOutAction()),
});

export const Header = connect(mapStateToProps, mapDispatchToProps)(_Header);