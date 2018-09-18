import React from 'react'
import PropTypes from 'prop-types'
import { invoke } from 'lodash'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import DeleteIcon from '@material-ui/icons/Delete'
import PeopleIcon from '@material-ui/icons/People'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import { formatDate } from 'utils/formatters'
import SharingDialog from '../SharingDialog'
import classesFromStyles from './ProjectTile.scss'

export const ProjectTile = ({
  open,
  project,
  numberOfCollaborators,
  classes,
  onSelect,
  onDelete,
  menuClick,
  closeMenu,
  anchorEl,
  sharingDialogOpen,
  toggleSharingDialog
}) => (
  <Paper
    className={classesFromStyles.container}
    open={open}
    data-test="project-tile">
    <div className={classesFromStyles.top}>
      <span
        className={classesFromStyles.name}
        onClick={() => onSelect(project)}
        data-test="project-tile-name">
        {project.name}
      </span>
      <div>
        <IconButton onClick={menuClick} data-test="project-tile-more">
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={closeMenu}>
          <MenuItem
            onClick={() => onSelect(project)}
            data-test="project-tile-edit">
            <ListItemIcon className={classesFromStyles.icon}>
              <EditIcon />
            </ListItemIcon>
            <ListItemText inset primary="Edit" />
          </MenuItem>
          <MenuItem onClick={onDelete} data-test="project-tile-delete">
            <ListItemIcon className={classesFromStyles.icon}>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText inset primary="Delete" />
          </MenuItem>
        </Menu>
      </div>
    </div>
    {project.createdAt ? (
      <span className={classesFromStyles.createdAt}>
        {formatDate(invoke(project.createdAt, 'toDate'))}
      </span>
    ) : null}
    <div className="flex-column">
      <Tooltip title="Collaborators" placement="bottom">
        <IconButton onClick={toggleSharingDialog}>
          <PeopleIcon />
        </IconButton>
      </Tooltip>
    </div>
    <SharingDialog
      open={sharingDialogOpen}
      project={project}
      onRequestClose={toggleSharingDialog}
    />
  </Paper>
)

ProjectTile.propTypes = {
  project: PropTypes.object.isRequired,
  numberOfCollaborators: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  menuClick: PropTypes.func.isRequired,
  closeMenu: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  anchorEl: PropTypes.object,
  toggleSharingDialog: PropTypes.func,
  sharingDialogOpen: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool
}

export default ProjectTile
