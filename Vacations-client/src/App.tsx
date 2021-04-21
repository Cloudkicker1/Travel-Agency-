import React from 'react';
import './App.css';
import { Switch, Route, Redirect } from 'react-router-dom';
import { VacationList } from './components/VacationList/VacationList';
import { Register } from './components/Register/Register';
import { Login } from './components/Login/Login';
import { CreateVacation } from './components/CreateVacation/CreateVacation';
import { AdminChart } from './components/Chart/AdminChart'
import { createGetVacationsAction, authenticateUserAction } from './actions'
import { Header } from './components/Header/Header';
import { connect } from 'react-redux';
import { State } from './store'
import { IVacation } from './models/vacation';

interface AppProps {
  isAdmin: boolean,
  isLoggedIn: boolean,
  vacations: IVacation[],
  getVacations(): void;
  authenticateUser(): void;
}

export class _App extends React.Component<AppProps> {

  render() {
    const { isAdmin, isLoggedIn, getVacations, vacations } = this.props;
    if (isLoggedIn && !vacations.length) {
      getVacations()
    }
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route path="/Vacations">
            <div>
              {isAdmin ? <CreateVacation /> : null}
              <VacationList />
            </div>
          </Route>
          <Route exact path="/login" component={Login} />
          <Route exact path='/register' component={Register} />
          <Route exact path="/adminchart" component={AdminChart} />
          <Route path='/'>
            <Redirect to='/login' />
          </Route>
        </Switch>
      </div>
    );
  }

  componentDidMount = () => {
    const { authenticateUser } = this.props;
    authenticateUser()
  }

}



const mapStateToProps = (state: State) => ({
  isAdmin: state.isAdmin,
  isLoggedIn: state.isLoggedIn,
  vacations: state.vacations,
})

const mapDispatchToProps = {
  getVacations: createGetVacationsAction,
  authenticateUser: authenticateUserAction,
}


const App = connect(mapStateToProps, mapDispatchToProps)(_App);

export default App;
