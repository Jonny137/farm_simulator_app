import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import AddIcon from '@material-ui/icons/Add';
import { IconButton, Tooltip, Fab } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import { BASE_URL, SOCKET_URL } from '../../utils/constants';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: theme.spacing(3),
    },
    table: {
        minWidth: 650,
    },
    health: {
        display: 'flex',
        alignItems: 'center',
        margin: 'auto',
        width: 'max-content',
    },
    icon: {
        marginRight: theme.spacing(1),
        color: 'gray',

        '&.green-health': {
            color: '#c1e1c1'
        },

        '&.red-health': {
            color: '#ff9994'
        },
    },
    addButton: {
        position: 'fixed',
        bottom: theme.spacing(4),
        right: theme.spacing(4),
    },
}));

export default function FarmBuildingUnits({ farmBuilding }) {
    const classes = useStyles();

    const [farmUnits, setFarmUnits] = useState([]);
    const [removeError, setOpenRemoveError] = useState(false);
    const [addError, setOpenAddError] = useState(false);
    const [feedError, setOpenFeedError] = useState(false);

    useEffect(() => {
        const socketIo = io(SOCKET_URL);

        socketIo.on('healthUpdate', (updatedFarmUnits) => {
            setFarmUnits(updatedFarmUnits.filter(
                unit => unit.farmBuildingId === farmBuilding.id
            ));
        });

        return () => {
            socketIo.disconnect();
        }
    }, []);

    useEffect(() => farmBuilding && setFarmUnits(farmBuilding.farmUnits), [farmBuilding]);

    async function feedUnit(id) {
        try {
            const farmUnit = await axios.put(`${BASE_URL}/farm-units/feed/${id}`);
            const newUnits = farmUnits.map(unit => {
                return farmUnit.data.id === unit.id ? farmUnit.data : unit
            });
            setFarmUnits(newUnits);
        } catch (error) {
            setOpenFeedError(true);
        }
    }

    async function handleAddUnit() {
        try {
            const data = {
                type: farmBuilding.unitType,
                farmBuildingId: farmBuilding.id
            }

            const farmUnit = await axios.post(`${BASE_URL}/farm-units`, data);

            setFarmUnits([...farmUnits, farmUnit.data]);
        } catch (error) {
            setOpenAddError(true);
        }
    }

    async function handleRemoveUnit(id) {
        try {
            await axios.delete(`${BASE_URL}/farm-units/${id}`);

            setFarmUnits(farmUnits.filter((unit) => unit.id != id));
        } catch (error) {
            setOpenRemoveError(true);
        }
    }

    const handleClose = (reason, severity) => {
        if (reason === 'clickaway') {
            return;
        }

        switch (severity) {
            case 'remove':
                setOpenRemoveError(false);
                break;
            case 'add':
                setOpenAddError(false);
                break;
            case 'feed':
                setOpenFeedError(false);
                break;
        }
    };

    return (
        <>
            <Head>
                <title>{farmBuilding.name}</title>
                <link rel="icon" href="/piggy.png" />
            </Head>
            <Container maxWidth="lg" className={classes.container}>
                <TableContainer component={Paper}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Unit ID</TableCell>
                                <TableCell align="center">Health</TableCell>
                                <TableCell align="center">Feed</TableCell>
                                <TableCell align="center">Remove</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {farmUnits.map((unit) => (
                                <TableRow key={unit.id}>
                                    <TableCell component="th" scope="row">
                                        {unit.id}
                                    </TableCell>
                                    <TableCell align="center">
                                        <div className={classes.health}>
                                            {
                                                unit.health > 0 &&
                                                <FavoriteIcon
                                                    className={`${classes.icon} ${unit.health >= 50 ? 'green-health' : 'red-health'}`}
                                                />
                                            }
                                            {
                                                unit.health === 0 &&
                                                <SentimentVeryDissatisfiedIcon
                                                    className={classes.icon}
                                                />
                                            }
                                            {unit.health}
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            disabled={unit.health === 0}
                                            onClick={() => feedUnit(unit.id)}
                                        >
                                            +1 HP
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleRemoveUnit(unit.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <Tooltip title="Add Farm Unit">
				<Fab color="primary" className={classes.addButton} onClick={handleAddUnit}>
					<AddIcon />
				</Fab>
            </Tooltip>
            <Snackbar open={removeError} autoHideDuration={3000} onClose={(event, reason) => handleClose(reason, 'remove')}>
                <Alert onClose={(event, reason) => handleClose(reason, 'remove')} severity='error'>
                    Failed to remove farm unit!
                </Alert>
            </Snackbar>
            <Snackbar open={addError} autoHideDuration={3000} onClose={(event, reason) => handleClose(reason, 'add')}>
                <Alert onClose={(event, reason) => handleClose(reason, 'add')} severity='error'>
                    Failed to add farm unit!
                </Alert>
            </Snackbar>
            <Snackbar open={feedError} autoHideDuration={3000} onClose={(event, reason) => handleClose(reason, 'feed')}>
                <Alert onClose={(event, reason) => handleClose(reason, 'feed')} severity='error'>
                    Cannot feed unit more than once in 5 seconds period!
                </Alert>
            </Snackbar>
        </>
    );
}

export async function getStaticPaths() {
    let paths = [];

    try {
        const response = await axios.get(`${BASE_URL}/farm-buildings`);
        paths = response.data.map((elem) => ({ params: { id: elem.id } }));
    } catch (error) {
        console.error(error);
    }

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    let farmBuilding;

    try {
        const response = await axios.get(
            `${BASE_URL}/farm-buildings/${params.id}`,
        );
        farmBuilding = response.data;
    } catch (error) {
        console.error(error);
    }

    return {
        props: {
            farmBuilding,
        },
    };
}
