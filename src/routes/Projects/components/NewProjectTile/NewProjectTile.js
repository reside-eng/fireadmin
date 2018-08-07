import React from 'react'
import PropTypes from 'prop-types'
import ContentAddCircle from '@material-ui/icons/AddCircle'
import Paper from '@material-ui/core/Paper'
import classes from './NewProjectTile.scss'

const iconSize = '6rem'
const iconStyle = { width: iconSize, height: iconSize, color: 'grey' }

export const NewProjectTile = ({ onClick }) => (
  <Paper
    className={classes.container}
    onClick={onClick}
    data-test="new-project-tile">
    <ContentAddCircle style={iconStyle} />
  </Paper>
)

NewProjectTile.propTypes = {
  onClick: PropTypes.func
}

export default NewProjectTile
