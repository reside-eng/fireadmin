import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { LinearProgress } from 'material-ui/Progress'
import ActionRunnerForm from '../ActionRunnerForm'
import RecentActions from '../RecentActions'
import classes from './ActionsPage.scss'

export const ActionsPage = ({
  selectActionTemplate,
  runAction,
  clearRunner,
  selectedTemplate,
  toggleTemplateEdit,
  templateEditExpanded,
  templateName,
  params,
  actionProcessing,
  project
}) => (
  <div className={classes.container}>
    <Typography className={classes.pageHeader}>Actions</Typography>
    <Typography className={classes.subHeader}>Recently Run Actions</Typography>
    <RecentActions
      params={params}
      selectActionTemplate={selectActionTemplate}
    />
    <Typography className={classes.subHeader}>Action Runner</Typography>
    <div className={classes.container}>
      <div className={classes.buttons}>
        <Button
          disabled={!selectedTemplate || actionProcessing}
          color="primary"
          variant="raised"
          aria-label="Run Action"
          onTouchTap={runAction}>
          Run Action
        </Button>
        {selectedTemplate && (
          <Button
            disabled={actionProcessing}
            color="secondary"
            variant="raised"
            aria-label="Clear"
            onTouchTap={clearRunner}
            className={classes.button}>
            Clear
          </Button>
        )}
      </div>
      <div className={classes.progress}>
        {actionProcessing && <LinearProgress color="primary" />}
      </div>
      <ActionRunnerForm
        environments={project.environments}
        project={project}
        projectId={params.projectId}
        selectedTemplate={selectedTemplate}
        initialValues={selectedTemplate}
        templateName={templateName}
        templateEditExpanded={templateEditExpanded}
        toggleTemplateEdit={toggleTemplateEdit}
        selectActionTemplate={selectActionTemplate}
      />
    </div>
  </div>
)

ActionsPage.propTypes = {
  project: PropTypes.object,
  selectedTemplate: PropTypes.object,
  params: PropTypes.object.isRequired, // from react-router
  runAction: PropTypes.func.isRequired, // from enhancer (withHandlers)
  clearRunner: PropTypes.func.isRequired, // from enhancer (withHandlers)
  selectActionTemplate: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  toggleTemplateEdit: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  templateEditExpanded: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  actionProcessing: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  templateName: PropTypes.string.isRequired
}

export default ActionsPage
