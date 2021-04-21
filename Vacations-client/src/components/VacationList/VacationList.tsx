import React from 'react';
import { IVacation } from '../../models/vacation';
import { Vacation } from '../Vacation/Vacation';
import { State } from '../../store';
import { connect } from 'react-redux';
// import { createGetVacationsAction } from '../../actions';
import './VacationList.css';

interface VacationListProps {
    vacations: IVacation[];
    // getVacations(): void;
    isLoading: boolean;
    isLoggedIn: boolean;
}

class _VacationList extends React.Component<VacationListProps> {

    render() {
        const { isLoading, vacations } = this.props;
        if (isLoading) {
            return 'Getting Vacations list...';
        }
        return (
            <div >
                {vacations.map((vacation, i) =>
                    <div key={vacation.ID} className='vacations'>
                        <Vacation {...vacation} />
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: State) => ({
    vacations: state.vacations,
    isLoading: state.isGettingVacations,
    isLoggedIn: state.isLoggedIn,
});

export const VacationList = connect(mapStateToProps)(_VacationList);
