import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'
import ActionRunnerForm from '../ActionRunnerForm'
import RecentActions from '../RecentActions'
import classes from './ActionsPage.scss'

export const ActionsPage = ({
  selectActionTemplate,
  runAction,
  runActionDisabled,
  clearRunner,
  selectedTemplate,
  toggleTemplateEdit,
  templateEditExpanded,
  templateName,
  submitActionRunner,
  params,
  actionProcessing
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
          disabled={runActionDisabled}
          color="primary"
          variant="raised"
          aria-label="Run Action"
          onClick={submitActionRunner}>
          Run Action
        </Button>
        {selectedTemplate && (
          <Button
            disabled={actionProcessing}
            color="secondary"
            variant="raised"
            aria-label="Clear"
            onClick={clearRunner}
            className={classes.button}>
            Clear
          </Button>
        )}
      </div>
      <div className={classes.progress}>
        {actionProcessing && <LinearProgress color="primary" />}
      </div>
      <ActionRunnerForm
        projectId={params.projectId}
        selectedTemplate={selectedTemplate}
        initialValues={selectedTemplate}
        templateName={templateName}
        templateEditExpanded={templateEditExpanded}
        toggleTemplateEdit={toggleTemplateEdit}
        selectActionTemplate={selectActionTemplate}
        onSubmit={runAction}
      />
    </div>
  </div>
)

ActionsPage.propTypes = {
  params: PropTypes.object.isRequired, // from react-router
  selectedTemplate: PropTypes.object, // from enhancer (withStateHandlers)
  runAction: PropTypes.func.isRequired, // from enhancer (withHandlers)
  submitActionRunner: PropTypes.func.isRequired, // from enhancer (withHandlers)
  clearRunner: PropTypes.func.isRequired, // from enhancer (withHandlers)
  selectActionTemplate: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  toggleTemplateEdit: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  templateEditExpanded: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  actionProcessing: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  runActionDisabled: PropTypes.bool.isRequired, // from enhancer (withProps)
  templateName: PropTypes.string.isRequired // from enhancer (withProps)
}

export default ActionsPage
