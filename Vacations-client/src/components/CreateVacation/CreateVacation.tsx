import React, { FormEvent } from 'react';
import { connect } from 'react-redux';
import { createVacationsAction } from '../../actions';
import "bootstrap/dist/css/bootstrap.min.css"
import { Button } from 'react-bootstrap';
import './CreateVacation.css'

import { AdminChart } from '../Chart/AdminChart';


interface CreateVacationProps {
    createVacation(
        Description: string,
        Destination: string,
        Picture: string,
        StarDate: string,
        EndDate: string,
        Price: string,
    ): void;
}

interface CreateVacationState {
    Description: string,
    Destination: string,
    Picture: string,
    StarDate: string,
    EndDate: string,
    Price: string,
}

class _CreateVacation extends React.Component<CreateVacationProps, CreateVacationState> {
    state: CreateVacationState = {
        Description: '',
        Destination: '',
        Picture: '',
        StarDate: '',
        EndDate: '',
        Price: '',
    }
    render() {
        const { Description, Destination, Picture, StarDate, EndDate, Price } = this.state;

        return (
            <div className="vacationAdderContainer">
                <h4 className='newVacTitle'>Add New Vacation:</h4>
                <form onSubmit={this.onSubmit} >
                    <div className='inputsContainer'>
                        <div className='firstInputsSection'>
                            <h6>Destination:</h6>
                            <input className='form-control' value={Destination} onChange={this.handleInputChange} placeholder='Destination' required name="Destination" />
                            <h6>Description:</h6>
                            <textarea className='form-control' value={Description} onChange={this.handleInputChange} required name="Description"
                                placeholder="Please describe the new vacation"></textarea>
                            <h6>Picture:</h6>
                            <input className='form-control' value={Picture} onChange={this.handleInputChange} placeholder='Image URL' required name="Picture" />
                        </div>
                        <div className='secondInputsSection'>
                            <h6>Depart On:</h6>
                            <input className='form-control' value={StarDate} onChange={this.handleInputChange} required name="StarDate" type="date" />
                            <h6>Return On:</h6>
                            <input className='form-control' value={EndDate} onChange={this.handleInputChange} required name="EndDate" type="date" />
                            <h6>Price:</h6>
                            <input className='form-control' value={Price} onChange={this.handleInputChange} placeholder='Price' required name="Price" />
                            <br />
                        </div>
                    </div>
                    <Button type="submit" >SAVE</Button>
                </form>
            </div>
        )
    }

    handleInputChange = (e: any) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any);
    }

    onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { Description, Destination, Picture, StarDate, EndDate, Price } = this.state;

        const { createVacation } = this.props;
        createVacation(Description, Destination, Picture, StarDate, EndDate, Price);
    }
}
const mapDispatchToProps = {
    createVacation: createVacationsAction,
}

export const CreateVacation = connect(null, mapDispatchToProps)(_CreateVacation);