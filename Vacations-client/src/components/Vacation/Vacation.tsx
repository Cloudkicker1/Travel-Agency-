import React, { FormEvent } from 'react';
import { connect } from 'react-redux';
import './Vacation.css';
import { Button, Modal, ModalBody, FormLabel, Form } from 'react-bootstrap';
import { deleteAction, updateVacationDetailsAction, toggleFollowAction } from '../../actions';
import { State } from '../../store';
import moment from 'moment';


interface VacationProps {
    deleteVacation(ID: number): void;
    updateVacationDetails(VacationId: number, Description: string, Destination: string, Picture: string, StarDate: Date, EndDate: Date, Price: number): void;
    toggleFollow(ID: number): void;
    Description: string,
    Destination: string,
    Picture: string,
    StarDate: Date,
    EndDate: Date,
    Price: number,
    ID: number,
    isAdmin: boolean,
    follow?: number,
}

interface VacationState extends VacationProps {
    isEdit: boolean;
    tempDescription: string;
    tempDestination: string;
    tempPicture: string;
    tempPrice: number;
    tempDeparture: Date;
    tempReturnat: Date;
    show: boolean;
}

class _Vacation extends React.Component<VacationProps, VacationState> {

    constructor(vacationProps: VacationProps) {
        super(vacationProps);

        const { Description, Destination, Picture, StarDate, EndDate, Price, isAdmin, deleteVacation, toggleFollow, updateVacationDetails, ID } = vacationProps;

        this.state = {
            show: false, isEdit: false, Description, Destination, Picture, StarDate, EndDate, Price, isAdmin, deleteVacation, toggleFollow, updateVacationDetails, ID, tempDescription: Description, tempDeparture: StarDate, tempReturnat: EndDate, tempDestination: Destination, tempPicture: Picture, tempPrice: Price
        };
    };

    render() {
        const { isEdit, show } = this.state;
        const { Description, Destination, Picture, StarDate, EndDate, Price, follow, isAdmin } = this.props;
        return (
            <div className='vacation' style={{ backgroundImage: `url(${Picture})` }}>
                <h4>{Destination}</h4>
                {console.log('BEFORE STATE CHANGE', follow)}
                {isAdmin ? <> <Button variant="danger" size="sm" className="deleteButton" onClick={this.handleDelete}>✘</Button>
                    <Button size="sm" variant="light" className="editButton" onClick={this.handleEdit}>✏</Button> </>
                    : follow ? <Button size="sm" className="followButton" onClick={this.handleFollow}>Follow ✔️</Button> :
                        <Button size="sm" className="followButton" onClick={this.handleFollow}>Follow</Button>}
                {console.log('BEFORE STATE CHANGE', follow)}
                <div className='detailsContainerBackgroung'>
                    <div className='detailsContainer'>
                        <h5>Description:</h5>
                        <div>{Description}</div>
                        <h5>Departure At:</h5>
                        <div>{moment(StarDate).format("MMMM Do YYYY")}</div>
                        <h5>Return At:</h5>
                        <div>{moment(EndDate).format("MMMM Do YYYY")}</div>
                        <h5>Price:</h5>
                        <div>{Price}$</div>
                    </div>
                </div>
                {isEdit ?
                    <Modal show={show} onHide={this.handleCloseModal}>
                        <Modal.Header>
                            <Modal.Title>Edit Vacation:</Modal.Title>
                        </Modal.Header>
                        <ModalBody>
                            <form onSubmit={this.onSubmit}>
                                <FormLabel>Destination:</FormLabel>
                                {' '}
                                <input className='form-control' value={this.state.Destination} onChange={this.handleInputChange} required name="Destination"
                                    placeholder="Destination" />
                                <FormLabel>Description:</FormLabel>
                                {' '}
                                <textarea className='form-control' value={this.state.Description} onChange={this.handleInputChange} required name="Description"
                                    placeholder="Description" />
                                <FormLabel>Departure At:</FormLabel>
                                {' '}
                                <input className='form-control' onChange={this.handleInputChange} name="StarDate" type='date' />
                                <FormLabel>Return At:</FormLabel>
                                {' '}
                                <input className='form-control' onChange={this.handleInputChange} name="EndDate" type='date' />
                                <FormLabel>Price:</FormLabel>
                                {' '}
                                <input className='form-control' onChange={this.handleInputChange} value={this.state.Price} required name="Price" type='number'
                                    placeholder='$$$' />
                                <FormLabel>Image:</FormLabel>
                                {' '}
                                <input className='form-control' onChange={this.handleInputChange} value={this.state.Picture} required name="Picture"
                                    placeholder="Pictue URL" />
                                <br />
                            </form>
                        </ModalBody>
                        <Modal.Footer>
                            <Button className='closeModal' onClick={this.handleCloseModal} variant="secondary">Close</Button>
                            <Button onClick={this.onSubmit} type='submit' variant="primary">Edit Fields</Button>
                        </Modal.Footer>
                    </Modal>
                    : null
                }
            </div>
        )
    }

    onSubmit = (e: FormEvent) => {
        e.preventDefault();
        const { updateVacationDetails, ID } = this.props;
        const { Description, Destination, Picture, StarDate, EndDate, Price, follow } = this.state;
        console.log('BEFORE STATE CHANGE', follow);
        updateVacationDetails(ID, Description, Destination, Picture, StarDate, EndDate, Price);
        this.setState({
            isEdit: false
        })
        console.log('AFTER STATE CHANGE', follow);
    }

    handleDelete = () => {
        const { ID, deleteVacation } = this.props;
        deleteVacation(ID)
    }

    handleFollow = () => {
        const { ID, toggleFollow } = this.props;
        toggleFollow(ID)
    }

    handleInputChange = (e: any) => {
        const { value, name } = e.target;
        this.setState({
            [name]: value,
        } as any);
    }

    handleCloseModal = () => {
        const { tempDescription, tempPrice, tempPicture, tempDestination, tempReturnat, tempDeparture } = this.state;
        this.setState({
            isEdit: false,
            show: false,
            Description: tempDescription,
            Destination: tempDestination,
            Price: tempPrice,
            StarDate: tempDeparture,
            EndDate: tempReturnat,
            Picture: tempPicture,
        })
    }
    handleEdit = () => {
        this.setState({
            isEdit: true,
            show: true,
        })
    }
}



const mapStateToProps = (state: State) => ({
    isAdmin: state.isAdmin,
});

const mapDispatchToProps = {
    deleteVacation: deleteAction,
    updateVacationDetails: updateVacationDetailsAction,
    toggleFollow: toggleFollowAction,

}

export const Vacation = connect(mapStateToProps, mapDispatchToProps)(_Vacation);