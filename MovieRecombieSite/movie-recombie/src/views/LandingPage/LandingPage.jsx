/*eslint-disable*/
import React from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";

import classNames from "classnames";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import CustomDropdown from 'components/CustomDropdown/CustomDropdown'
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// @material-ui/icons
import Favorite from "@material-ui/icons/Favorite";
// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Button from "components/CustomButtons/Button.jsx";
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import Parallax from "components/Parallax/Parallax.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import landingPageStyle from "assets/jss/material-kit-pro-react/views/landingPageStyle.jsx";
import MoviesCards from 'components/MovieCards/MovieCards'
// Sections for this page
import SectionProduct from "./Sections/SectionProduct.jsx";
import SectionTeam from "./Sections/SectionTeam.jsx";
import SectionWork from "./Sections/SectionWork.jsx";
import Papa from 'papaparse';
import * as d3 from 'd3'
import MovieCards from "components/MovieCards/MovieCards.jsx";
class LandingPage extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    
  }  handleSimple = event => {
    this.setState({ 
      [event.target.name]: event.target.value ,
      lowpageloading:true,
      multipleSelect:[100]

    });
    
    
    fetch("http://localhost:8002/alpha/"+String.fromCharCode(event.target.value+97)).then(a=>a.json()).then(data=>{
       this.setState({
         result:data,
         page:1,
         character:String.fromCharCode(event.target.value+97)
       })
    })
  
  };
  searchFor=(search)=>{
    fetch("http://localhost:8002/search/"+search).then(a=>a.json()).then(data=>{
       this.setState({
         result:data,
         page:1,
         character:'a',
         multipleSelect:[100],
         lowpageloading:false,
         simpleSelect:100,
       })

    }).catch(err=>{console.log("NOt FOund")})
  }
  constructor(props){
    super(props)
    this.state={
      result:null,
      character : 'a',
      genre : 'Action',
      simpleSelect:0,
      multipleSelect: [],
      lowpageloading:true,
      main:<div>LOADING</div>,
      page:1,
      ratedmovies:0,
      ratingData:{},
      dialog:false,
      recommendedMovies:[]
    }

  

    fetch("http://localhost:8002/alpha/"+this.state.character).then(a=>a.json()).then(data=>{
       this.setState({
         result:data
       })
    })
    fetch("http://localhost:8002/apiv1/getgenre").then(a=>a.json()).then(data=>{
       this.setState({
         genres_all:data
       })
       
    })
    this.getDocHeight()

  }
  handleClickOpen=()=> {
    this.setState({
      dialog:true
    })
  }

  handleClose=()=> {
    this.setState({
      dialog:false
    })
  }
  handleMultiple =async (event) => {

    var genresUrl= 'http://localhost:8002/genre/'
    var madeUP=''
    if(event.target.value[0]==100){
      event.target.value.shift();
    }
    await this.setState({ 
      multipleSelect: event.target.value,    
      simpleSelect:100,
      lowpageloading:false
    });
    await  this.state.multipleSelect.map(data=>{
      console.log(data)
      madeUP=madeUP + this.state.genres_all[data]+"&"
    })
    genresUrl=genresUrl+madeUP;
    await console.log(genresUrl)
    await  fetch(genresUrl).then(a=>a.json()).then(data=>{
      this.setState({
        result:data,
        genre:madeUP
      })
    }).catch(err=>{
      console.log("A small error maybe")
    })

  };
  loadnextPage=(pagenumber)=>{
    if(this.state.lowpageloading){
    fetch("http://localhost:8002/alpha/"+this.state.character+"?page="+pagenumber).then(a=>a.json()).then(data=>{
       this.setState({
         result:data,
         page:pagenumber,
         
       })
       
      })
  }
  else{
    fetch("http://localhost:8002/genre/"+this.state.genre+"?page="+pagenumber).then(a=>a.json()).then(data=>{
       this.setState({
         result:data,
         page:pagenumber,
         
       })
       
      })
  }
}
submitTheData=async ()=>{
  fetch('http://localhost:8002/predict', {
    method: 'post',
    body: JSON.stringify(this.state.ratingData)
  }).then(function(response) {
    return response.json()
  }).then(async (data)=>{
    data=data.trim().split("   ")
    data.shift()
   var l =[]
   await  data.map(async (d)=>{
      await fetch("http://localhost:8002/movieid/"+d.split("\n")[0]).then(async(blob)=>await blob.json())
      .then(async (reality)=>{
    
        this.setState({ recommendedMovies: [...this.state.recommendedMovies, <MovieCards state={this.change} title={reality[0]} movieId={reality[4]} imageLink={reality[1]} summaryData={reality[2]}/> ] }) 
        
      
      })
      .catch(err=>{
        return undefined;
      })
     
    })
 
  await  this.handleClickOpen();
  })

}
  change=(name,rating)=>{
    let movieobject= this.state.ratingData;
    movieobject[name]=rating;
    console.log(movieobject);
    this.setState({
      ratingData:movieobject
    })
  let newmovies = Object.keys(this.state.ratingData).length;
  this.setState({
    ratedmovies:newmovies
  })
  }
  getDocHeight=()=>{
    window.onscroll= (ev)=>{
      if((window.innerHeight+window.scrollY)>=document.body.offsetHeight-100){
        this.loadnextPage((this.state.page  )+1 );
      }
    }
  }



    render() {
    const { classes, ...rest } = this.props;
    var c='A';
    var atozee  = []
    for(let i=0;i<26;i++){
      atozee.push(
        <MenuItem
        classes={{
          root: classes.selectMenuItem,
          selected: classes.selectMenuItemSelected
        }}
        value={i}
        >
        {c}
        </MenuItem>
      );
      c=String.fromCharCode(c.charCodeAt(0) + 1);
    }
   
   const main=this.state.result !=null ? this.state.result.map(data=>{
     return <MovieCards state={this.change} title={data[0]} movieId={data[4]} imageLink={data[1]} summaryData={data[2]}/>
   }):null
   var jk=-1
   const maingenre=this.state.genres_all !=null ? this.state.genres_all.map(data=>{
    jk++;
    return  <MenuItem
    classes={{
      root: classes.selectMenuItem,
      selected: classes.selectMenuItemSelectedMultiple
    }}
    value={jk}
  >
    {data}
  </MenuItem>
  }):null
    console.log(this.state.recommendedMovies)
    return (
      <div>
          <Dialog
          fullWidth={1000}
          maxWidth={1366}
        open={this.state.dialog}
        keepMounted
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{"Movies you would like : "}</DialogTitle>
        <DialogContent>
        <Grid container spacing={3} style={{padding:10}} >
        {this.state.recommendedMovies}
        </Grid>

</DialogContent>

      </Dialog>
        <Header
          color="transparent"
          brand="MovieRecombe"
          links={<HeaderLinks  
            SubmitFunc={this.submitTheData}
            searchFor={this.searchFor}  
          rating={this.state.ratedmovies}
          dropdownHoverColor="info" />}
          fixed
          changeColorOnScroll={{
            height: 100,
            color: "primary"
          }}
          {...rest}
        />
        
        <Parallax image={require("assets/img/bg8.jpg")} filter="dark">
          <div className={classes.container}>
            <GridContainer>
              <GridItem xs={12} sm={6} md={6}>
                <h1 className={classes.title}>What is Movie-Recombe ? </h1>
                <h4>
                  We recomend movies based on your preferences. We would like you to rate the movies that you have watched 
                  and we will recomend movies based on your choices.
                </h4>
                <br />
                <Button
                  color="primary"
                  size="lg"
                  href="https://www.youtube.com/watch?v=dQw4w9WgXcQ&ref=creativetim"
                  target="_blank"
                >
                  <i className="fas fa-play" />
                  Watch video
                </Button>
               
              </GridItem>
            </GridContainer>
          </div>
        </Parallax>
        <div className={classNames(classes.main, classes.mainRaised)}>
        <Grid container spacing={2}    justify="space-around"
  alignItems="center" direction="row" >

            <Grid item  xl={4} lg={4} md={8} >
            <h1 className="heading_of_page">Rate watched movies</h1>
            </Grid>
            <Grid item xl={1} lg={1} md={1}>
            <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="multiple-select"
                        className={classes.selectLabel}
                      >
                       Select
                      </InputLabel>
                      <Select
                                  color="rose"

                        MenuProps={{
                          className: classes.selectMenu
                        }}
                        classes={{
                          select: classes.select
                        }}
                        value={this.state.simpleSelect}
                        onChange={this.handleSimple}
                        inputProps={{
                          name: "simpleSelect",
                          id: "simple-select"
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                          value="100"
                        >
                          -
                        </MenuItem>
                       {atozee}
                       
                    
                      </Select>
                    </FormControl>
                    </Grid>
                  <Grid item xs={12} sm={6} md={2} lg={2}>
                  <FormControl
                      fullWidth
                      className={classes.selectFormControl}
                    >
                      <InputLabel
                        htmlFor="multiple-select"
                        className={classes.selectLabel}
                      >
                        Genres
                      </InputLabel>
                      <Select
                        multiple
                        value={this.state.multipleSelect}
                        onChange={this.handleMultiple}
                        MenuProps={{
                          className: classes.selectMenu,
                          classes: { paper: classes.selectPaper }
                        }}
                        classes={{ select: classes.select }}
                        inputProps={{
                          name: "multipleSelect",
                          id: "multiple-select"
                        }}
                      >
                        <MenuItem
                          disabled
                          classes={{
                            root: classes.selectMenuItem
                          }}
                          value="100"
                        >
                          -
                        </MenuItem>
                       {maingenre}
                      </Select>
                    </FormControl>
            </Grid>
          <Grid container  justify="center" spacing={4} style={{padding:20}}>

            {main}

        </Grid>


                </Grid>
                </div>

        <Footer
          content={
            <div>
              <div className={classes.left}>
                <List className={classes.list}>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="https://www.creative-tim.com/?ref=mkpr-landing"
                      target="_blank"
                      className={classes.block}
                    >
                      College Project
                    </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="https://www.creative-tim.com/presentation?ref=mkpr-landing"
                      target="_blank"
                      className={classes.block}
                    >
                      About us
                    </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="//blog.creative-tim.com/"
                      className={classes.block}
                    >
                      Blog
                    </a>
                  </ListItem>
                  <ListItem className={classes.inlineBlock}>
                    <a
                      href="https://www.creative-tim.com/license?ref=mkpr-landing"
                      target="_blank"
                      className={classes.block}
                    >
                      Licenses
                    </a>
                  </ListItem>
                </List>
              </div>
              <div className={classes.right}>
                &copy; {1900 + new Date().getYear()} , made with{" "}
                <Favorite className={classes.icon} /> by{" "}
                <a
                  href="https://www.creative-tim.com/?ref=mkpr-landing"
                  target="_blank"
                >
                  Creative Tim
                </a>{" "}
                for a better web.
              </div>
            </div>
          }
        />
      </div>
    );
  }
}

LandingPage.propTypes = {
  classes: PropTypes.object
};

export default withStyles(landingPageStyle)(LandingPage);
