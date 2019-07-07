import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import StarRatings from 'react-star-ratings';


class MovieCards extends React.Component {
  changeRating=( newRating, name )=> {
    this.setState({
      rating: newRating
    });
    this.props.state(name,newRating);
  }
  constructor(){
    super()
this.state={
  rating:0
}
  }
    render(){
        return(
          <Grid item xl={3} lg={3} md={3}>
            <Card style={{maxWidth:375}}  >
            <CardActionArea>
              <CardMedia
                component="img"
                alt={this.props.title}
                height="140"
                image="https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_QL50_SY1000_SX670_AL_.jpg"
                title={this.props.title}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                {this.props.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                  across all continents except Antarctica
                </Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
            <StarRatings
          rating={this.state.rating}
          starRatedColor="blue"
          changeRating={this.changeRating}
          numberOfStars={5}
          starRatedColor="purple"
          name={this.props.movieId}
          starDimension="20px"
          starSpacing="1px"
        />
              <Button size="small" color="primary">
                Learn More
              </Button>
            </CardActions>
          </Card>
          </Grid>
        )
    }
}

export default MovieCards;