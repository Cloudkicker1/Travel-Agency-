import React, { ChangeEvent, FormEvent } from 'react';
import { connect } from 'react-redux';
import "bootstrap/dist/css/bootstrap.min.css"
import { registerAction } from '../../actions';
import { Button } from 'react-bootstrap';
import './Register.css'
import { Redirect, useHistory, Link, BrowserRouter } from 'react-router-dom';



interface RegisterProps {
    register(firstName: string, lastName: string, userName: string, password: string): void;
    backToHomePage(): void;
    isLoggedIn: Boolean;
}

interface RegisterState {
    firstName: string;
    lastName: string;
    userName: string;
    password: string;
    isLoggin: boolean;
}

class _Register extends React.Component<RegisterProps, RegisterState> {
    state: RegisterState = {
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        isLoggin: false,
    }

    render() {
        const { firstName, lastName, userName, password } = this.state;
        const { isLoggedIn } = this.props;

        if (isLoggedIn) {
            return <Redirect to="/vacations" />;
        }

        return (
            <div>
                <h1>Register:</h1>
                <form onSubmit={this.onSubmit}>
                    <input className='form-control' name="firstName" value={firstName} onChange={this.handleInputChange} placeholder="First Name" required />
                    <br />
                    <input className='form-control' name="lastName" value={lastName} onChange={this.handleInputChange} placeholder="Last Name" required />
                    <br />
                    <input className='form-control' name="userName" value={userName} onChange={this.handleInputChange} placeholder="User Name" required />
                    <br />
                    <input className='form-control' name="password" value={password} onChange={this.handleInputChange} type="Password" placeholder="Password..." required />
                    <br />
                    <Button type="submit">REGISTER</Button>
                </form>
                <br />
                <div>
                    <Link to='/login'><Button variant='success' className='homePageButton'>Home Page</Button></Link>
                </div>
            </div >
        );
    }

    handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any);
    }

    onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { firstName, lastName, userName, password } = this.state;
        this.setState({
            isLoggin: true,
        })
        const { register } = this.props;
        register(firstName, lastName, userName, password);
    }
}

const mapDispatchToProps = {
    register: registerAction,
}

const mapStateToProps = (state: any) => {
    return {
        isLoggedIn: state.isLoggedIn
    };
}

export const Register = connect(mapStateToProps, mapDispatchToProps)(_Register);