import React, { Component } from 'react';
import { Bar, ChartData } from 'react-chartjs-2';
import { State } from '../../store';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import './AdminChart.css';
import { IVacation } from '../../models/vacation';
import { Button } from 'react-bootstrap';


interface ChartProps {
    vacations: IVacation[];
    isAdmin: boolean;
}

interface ChartState extends ChartProps {
    chartData: any,
    labels: any[];
}

class _AdminChart extends Component<ChartProps, ChartState> {

    render() {
        const { vacations, isAdmin } = this.props;
        if (!isAdmin) {
            return <Redirect to="/vacations" />;
        }

        const data: ChartData<any> = {
            labels: [],
            datasets: [
                {
                    label: 'number of followers',
                    data: [],
                    backgroundColor: "pink",
                    borderColor: "red",
                    borderWidth: 1,
                }
            ]
        }

        vacations.forEach((vacation) => {
            const { Destination, NumOfFollowers } = vacation;
            if (NumOfFollowers) {
                data.labels.push(Destination)
                data.datasets[0].data.push(NumOfFollowers)
            }
        })
        return (
            <div className='chart'>
                <div>
                    <Link to="/vacations"><Button className='homePageLink' variant='success'>Home Page</Button></Link>
                </div>
                <Bar
                    data={data}
                    options={{
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    callback: function (value: any) { if (value % 1 === 0) { return value; } }
                                }
                            }]
                        },
                        title: {
                            display: true,
                            text: 'Vacations chart',
                            fontSize: 25
                        },
                        legend: {
                            display: false,
                            position: 'right'
                        }
                    }}
                />
            </div>

        )
    }
}
const mapStateToProps = (state: State) => ({
    vacations: state.vacations,
    isAdmin: state.isAdmin,
});

export const AdminChart = connect(mapStateToProps)(_AdminChart);