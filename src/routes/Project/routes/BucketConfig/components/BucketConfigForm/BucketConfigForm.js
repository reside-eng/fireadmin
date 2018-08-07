import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { map } from 'lodash'
import MenuItem from '@material-ui/core/MenuItem'
import { Field, FieldArray } from 'redux-form'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { Select } from 'redux-form-material-ui'
import Paper from '@material-ui/core/Paper'
import CorsList from '../CorsList'
import classes from './BucketConfigForm.scss'

export const BucketConfigForm = ({
  handleSubmit,
  pristine,
  serviceAccount,
  storageBucket,
  method,
  reset,
  projectEnvironments,
  currentConfig,
  body,
  submitting
}) => (
  <form onSubmit={handleSubmit} className={classes.container}>
    <div className={classes.buttons}>
      <Button
        color="primary"
        type="submit"
        variant="raised"
        disabled={pristine || submitting || (method === 'PUT' && !body)}
        className={classes.button}>
        Run Bucket Action
      </Button>
      <Button
        color="secondary"
        variant="raised"
        disabled={pristine || submitting}
        onClick={reset}>
        Cancel
      </Button>
    </div>
    <Paper className={classes.paper}>
      <FormControl className={classes.field}>
        <InputLabel htmlFor="environment">Environment</InputLabel>
        <Field
          name="environment"
          component={Select}
          fullWidth
          inputProps={{
            name: 'environment',
            id: 'environment'
          }}>
          {map(projectEnvironments, ({ id, name, fullPath }, i) => (
            <MenuItem key={`Environment-${id}-${i}`} value={id}>
              {name}
            </MenuItem>
          ))}
        </Field>
      </FormControl>
      <FormControl className={classes.field}>
        <InputLabel htmlFor="method">Method</InputLabel>
        <Field
          name="method"
          component={Select}
          placeholder="Action"
          fullWidth
          inputProps={{
            name: 'method',
            id: 'method'
          }}>
          <MenuItem value="GET">Get Config</MenuItem>
          <MenuItem value="PUT">Update Config</MenuItem>
        </Field>
      </FormControl>
      <FormControl className={classes.field} disabled>
        <InputLabel htmlFor="bucket">
          {storageBucket || 'Storage Bucket (defaults to app bucket)'}
        </InputLabel>
        <Field
          name="bucket"
          component={Select}
          fullWidth
          inputProps={{
            name: 'bucket',
            id: 'bucket'
          }}>
          <MenuItem value="empty">empty</MenuItem>
        </Field>
      </FormControl>
    </Paper>
    <Paper className={classes.paper}>
      <Typography
        className={classes.subHeader}
        variant="headline"
        component="h2">
        CORS Configuration
      </Typography>
      <FieldArray name="body.cors" component={CorsList} />
    </Paper>
  </form>
)

BucketConfigForm.propTypes = {
  body: PropTypes.object,
  method: PropTypes.string,
  projectEnvironments: PropTypes.array,
  currentConfig: PropTypes.object,
  serviceAccount: PropTypes.object,
  storageBucket: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired, // from enhancer (reduxForm)
  pristine: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  submitting: PropTypes.bool.isRequired, // from enhancer (reduxForm)
  reset: PropTypes.func.isRequired // from enhancer (reduxForm)
}

export default BucketConfigForm
