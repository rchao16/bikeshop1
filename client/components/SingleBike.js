import React, {Component} from 'react'
import { connect } from 'react-redux';
import {
    fetchOneBike,
    fetchReview,
    incrementCart,
    postReview
} from '../store'
import {
    Grid,
    Paper,
    Button,
    Typography,
    TextField,
    FormControlLabel,
    RadioGroup,
    FormLabel,
    FormControl,
    Radio,
} from '@material-ui/core'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const style = {
    Paper: {
        padding: 10,
        marginTop:10,
        marginBottom:10
    }
}

const styles = theme => ({
    root: {
      display: 'flex',
    },
    formControl: {
      margin: theme.spacing.unit * 3,
    },
    group: {
      margin: `${theme.spacing.unit}px 0`,
    },
    productOuter: {
      minHeight: '80vh'
    },
    productWrapper: {
      margin: 'auto' ,
      padding: 'auto 0',
      display: 'flex',
      flexDirection: 'row',
    },
    productImg: {
      height: '50vh',
      width: 'auto',
    },
    productInfo: {
      display: 'flex',
      flexDirection: 'column',
      padding: '30px',
    },
    productName: {
      color: 'black',
      fontSize: '18px'
    },
    productDescription: {
      color: 'grey',
    },
    addBtn: {
      margin: 'auto 0 0 auto',
    },
    subInfo: {
      display: 'flex',
      flexDirection: 'row',
    },
    reviewWrapper: {
      width: '50vw',
      margin: '0 auto',
    },
    reviewTextWrapper: {
      textAlign: 'center'
    },
    reviewRating: {
      // borderBottom: '1px lightgrey'
    },
    reviewUnderline: {
      borderBottom: '1px lightgrey'
    },
    reviewCommentTitle: {
      fontSize: '18px',
      color: 'black'
    },
    reviewComments: {
      fontSize: '14px',
      color: 'grey',
    },
    reviewInputWrapper: {
      margin: '0 auto',
      width: '80vw',
      maxWidth: '1300px',
    },
    reviewInput: {
      margin: 'auto 0',
      // border: '1px solid grey',
      width: '75vw',
      maxWidth: '1200px',
    },
    ratingBtns: {
      margin: 'auto 0',
    },
    reviewTitle: {
      color: 'black',
      fontSize: '20px',
    },
    submitBtnWrapper: {

    },
    formWrapper: {
      textAlign: 'center',
      margin: 'auto',
      display: 'flex',
      flexDirection: 'column',
    }
  });

class SingleBike extends Component {
    constructor() {
        super();
        this.state = {
            comments: '',
            value:''
        }
    }

    componentDidMount() {
        const id = this.props.match.params.id
        this.props.fetchOneBike(id);
        this.props.fetchReview(id);

    }

    handleClickAddToCart(bikeId) {
        let cartId=0;
        if (this.props.cart.cartId) {
          cartId=this.props.cart.cartId
        }
        this.props.incrementCart(cartId,bikeId)

      }

    handleChange = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value
        })
        this.setState({ value:evt.target.value })
    }



    render() {
        const {name, description, price, inventory} = this.props.singleBike
        const review = this.props.review
        const id = this.props.match.params.id
        const { classes } = this.props;
        let avgRating=0
        if (!this.props.singleBike.id || review === undefined) {
            return (
                <Grid container>
                    Loading..
                </Grid>
            )
        }


        if (review.length>0) {

        review.map(elem => {
            avgRating += elem.rating
        })
        avgRating = avgRating / review.length
        }


        return (
            <div>
              {/* Begin bike information */}
            <Grid container spacing={24} className={classes.productOuter}>
                <Grid item md key={this.props.singleBike.id} className={classes.productWrapper} >
                    {/* <Paper style={style.Paper}> */}
                    <img
                      src={this.props.singleBike.bikeimages[0] && this.props.singleBike.bikeimages[0].imageUrl}
                      className={classes.productImg}
                    />

                    <div className={classes.productInfo}>
                      <Typography
                          gutterBottom
                          variant="subheading"
                          component="h1"
                          className={classes.productName}>
                          {name}
                      </Typography>

                      <Typography
                          gutterBottom
                          variant="subheading"
                          component="h3"
                          className={classes.productDescription}>
                          {description}
                      </Typography>

                      <div className={classes.subInfo}>

                        <div>
                          <Typography
                            gutterBottom
                            variant="subheading"
                            component="h3">
                            ${price}
                          </Typography>

                          <Typography
                            gutterBottom
                            variant="subheading"
                            component="h3">
                            {inventory} in stock
                          </Typography>

                          <Typography
                            gutterBottom
                            variant="subheading"
                            component="h3">
                            Average Rating: {avgRating.toFixed(1)}
                          </Typography>
                        </div>

                        <Button
                          onClick={() => this.handleClickAddToCart(id)}size="small"
                          color="primary"
                          className={classes.addBtn}>
                          Add to cart
                        </Button>
                      </div>
                    </div>

                    {/* </Paper> */}
                </Grid>
            </Grid>
            {/* End Bike Information */}
            {/* Begin review list */}
            <Grid
              container spacing={24}
              className={classes.reviewWrapper}>
                <Grid item md key={this.props.singleBike.id}>
                    {review.map(elem => {
                        return(
                            <Paper
                              key={elem.id}
                              style={style.Paper}
                              className={classes.reviewTextWrapper}>
                              <div className={classes.reviewUnderline}>
                                <label className={classes.reviewRating}> Rating | {elem.rating} stars</label>
                              </div>
                                <label className={classes.reviewCommentTitle}> Comments </label><br />
                                <h4 className={classes.reviewComments}>{elem.comments}</h4>
                            </Paper>
                        )
                    })}
                    {review.length === 0 && (
                        <Paper>
                            <Typography variant="display1" align="center">
                                No past reviews
                            </Typography>
                        </Paper>
                    )}

                </Grid>
            </Grid>
            {/* End review list */}

            {/* begin review form */}
            <Paper className={classes.reviewInputWrapper}>
              <form
                className={classes.formWrapper}
                onSubmit={(evt) => {
                  evt.preventDefault()
                  this.setState({comments:'', value: ''})
                  this.props.handleSubmit(evt,id)
              }}>
                <Typography
                  gutterBottom
                  variant="subheading"
                  component="h3"
                  className={classes.reviewTitle}>
                  LEAVE A REVIEW:
                </Typography>
                <div>
                  <TextField
                    name='comments'
                    value={this.state.comments}
                    onChange={this.handleChange}
                    onSubmit={this.props.handleSubmit}
                    multiline={true}
                    rows={5}
                    className={classes.reviewInput}
                  />
                </div>

                <div className={classes.ratingBtns}>
                    <FormControl component="fieldset" className={classes.formControl}>
                    <FormLabel component="legend"></FormLabel>
                    <RadioGroup
                        row
                        aria-label="Gender"
                        name="rating"
                        className={classes.group}
                        value={this.state.value}
                        onChange={this.handleChange}
                    >
                        <FormControlLabel value="1" control={<Radio />} label="1" />
                        <FormControlLabel value="2" control={<Radio />} label="2" />
                        <FormControlLabel value="3" control={<Radio />} label="3" />
                        <FormControlLabel value="4" control={<Radio />} label="4" />
                        <FormControlLabel value="5" control={<Radio />} label="5" />
                    </RadioGroup>
                    </FormControl>
                </div>
                <div className={classes.submitBtnWrapper}>
                  <Button type='submit'> Submit </Button>
                </div>
              </form>
            </Paper>
            {/* End review form */}
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
            singleBike: state.bikes.singleBike,
            review: state.review.greview,
            cart: state.cart
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchOneBike: (id) => {
            dispatch(fetchOneBike(id))
        },
        fetchReview: (id) => {
            dispatch(fetchReview(id))
        },
        incrementCart: (cartId,bikeId) => {
            dispatch(incrementCart(cartId,bikeId))
        },
        handleSubmit: (evt, bikeId) => {
            const comments = evt.target.comments.value
            const rating = evt.target.rating.value
            dispatch(postReview({comments,rating,bikeId}, bikeId))
        }
    }
}

SingleBike.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SingleBike))
