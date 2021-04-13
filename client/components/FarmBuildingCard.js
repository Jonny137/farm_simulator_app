import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import { Button, CardActions, IconButton, Snackbar } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';

import { removeFarmBuilding } from '../redux/farm-building/actions';
import { BASE_URL } from '../utils/constants';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme) => ({
    title: {
        fontWeight: 'bold',
    },
    unitType: {
        marginBottom: theme.spacing(2),
        fontWeight: 'bold',
    },
    listItem: {
        fontWeight: 'bold',
        marginRight: theme.spacing(1),
    },
    chip: {
        fontWeight: 'bold',
        marginBottom: theme.spacing(1),
    },
    aliveChip: {
        backgroundColor: '#c1e1c1',
    },
    deadChip: {
        backgroundColor: '#ff9994',
    },
    button: {
        '&:hover': {
            cursor: 'pointer',
            transform: 'scale(1.05)',
        },
    },
}));

export default function FarmBuildingCard({ building }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [openRemoveError, setOpenRemoveError] = useState(false);

    const handleDeleteFarmBuilding = async () => {
        try {
            await axios.delete(`${BASE_URL}/farm-buildings/${building.id}`);
            dispatch(removeFarmBuilding(building.id));
        } catch (error) {
            setOpenRemoveError(true);
        }
    };

    const handleClose = reason => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenRemoveError(false);
    };

    return(
        <>
            <Card>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        {building.id}
                    </Typography>
                    <Typography
                        className={classes.title}
                        variant="h5"
                        component="h2"
                    >
                        {building.name}
                    </Typography>
                    <Typography
                        className={classes.unitType}
                        color="textSecondary"
                    >
                        {building.unitType}
                    </Typography>
                    <Typography
                        color="textSecondary"
                        className={classes.listItem}
                        variant="body2"
                        component="span"
                    >
                        Total:
                    </Typography>
                    <Chip
                        label={building.numOfUnits}
                        size="small"
                        className={classes.chip}
                    />

                    <br />

                    <Typography
                        color="textSecondary"
                        className={classes.listItem}
                        variant="body2"
                        component="span"
                    >
                        Alive:
                    </Typography>
                    <Chip
                        label={building.alive}
                        size="small"
                        className={`${classes.chip} ${classes.aliveChip}`}
                    />

                    <br />

                    <Typography
                        color="textSecondary"
                        className={classes.listItem}
                        variant="body2"
                        component="span"
                    >
                        Dead:
                    </Typography>
                    <Chip
                        label={building.dead}
                        size="small"
                        className={`${classes.chip} ${classes.deadChip}`}
                    />
                </CardContent>
                <CardActions>
                <Link href="/building/[id]"  as={`/building/${building.id}`}>
                    <Tooltip title="View details">
                        <Button
                            className={classes.button}
                            variant="outlined"
                            color="primary"
                            size="small"
                        >
                            Details
                        </Button>
                    </Tooltip>
                </Link>
                <Tooltip title="Remove farm building">
                    <IconButton onClick={handleDeleteFarmBuilding}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                </CardActions>
            </Card>
            <Snackbar open={openRemoveError} autoHideDuration={3000} onClose={handleClose}>
                <Alert onClose={(handleClose)} severity='error'>
                    Failed to remove farm building.
                </Alert>
            </Snackbar>
        </>
    );
}
