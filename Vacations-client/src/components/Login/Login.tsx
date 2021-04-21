import React, { ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css"
import { loginAction } from '../../actions';
import { Button } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import './Login.css'


interface LoginProps {
    login(userName: string, password: string): void;
    isLoggedIn: boolean;
    loginFailRes: string,
}

interface LoginState {
    userName: string;
    password: string;
}

class _Login extends React.Component<LoginProps, LoginState> {
    state: LoginState = {
        userName: '',
        password: '',
    }

    render() {
        const { userName, password } = this.state;
        const { isLoggedIn, loginFailRes } = this.props;

        if (isLoggedIn) {
            return <Redirect to="/vacations" />;
        }

        return (
            <div>
                <h1>Welcome!, we hope you'll find a vacation to your liking :)</h1>
                <div className='loginForm'>
                    <h2>Login:</h2>
                    <form onSubmit={this.onSubmit}>
                        <input className='form-control' name="userName" value={userName} onChange={this.handleInputChange} placeholder="Username" required />
                        <br />
                        <input className='form-control' name="password" value={password} onChange={this.handleInputChange} type="password" placeholder="Password" required />
                        <br />
                        <Button type="submit">Login</Button>
                    </form>
                    {loginFailRes === '' ? null : <div className='loginMsg'> {loginFailRes} </div>}
                    <h6>Dont have an account?</h6>
                    <Link to='/register'><Button variant='success' className="registerButton">Click Here!</Button></Link>
                </div>
            </div>
        );
    }
    onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { userName, password } = this.state;
        const { login } = this.props;
        login(userName, password);

    }
    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any);
    }

}
const mapDispatchToProps = {
    login: loginAction,
}
const mapStateToProps = (state: any) => {
    return {
        isLoggedIn: state.isLoggedIn,
        loginFailRes: state.message,
    };
}

export const Login = connect(mapStateToProps, mapDispatchToProps)(_Login);