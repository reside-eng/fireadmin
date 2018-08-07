export default theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular
  },
  header: {
    padding: theme.spacing.unit * 2
  },
  headerLeft: {
    marginRight: theme.spacing.unit * 24,
    fontColor: theme.palette.text.primary,
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightRegular
  },
  headingPaper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    fontColor: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightRegular
  }
})
