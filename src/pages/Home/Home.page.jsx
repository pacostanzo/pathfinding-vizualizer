import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createGrid, createMaze } from '../../redux/grid/gridActions';
import { Grid, Filter } from '../../components';
import './Home.styles.scss';

class Home extends Component {
  render() {
    const { createGrid, createMaze } = this.props;

    return (
      <div className="home">
        <div className="top">
          <div>
            <h1 className="title">Graph Visualizer</h1>
          </div>
          <div>
            <button className="create-grid" onClick={createGrid}>
              <span className="squirk">Create Grid</span>
            </button>
          </div>
          <div>
            <button
              className="create-maze"
              onClick={() => {
                createGrid();
                createMaze();
              }}
            >
              <span className="squirk">Create Maze</span>
            </button>
          </div>
        </div>
        <div className="middle"></div>
        <div className="bottom">
          <div className="filter-container">
            <Filter></Filter>
          </div>
          <div className="grid-container">
            <Grid></Grid>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  createGrid: () => dispatch(createGrid()),
  createMaze: () => dispatch(createMaze()),
});

export default connect(null, mapDispatchToProps)(Home);
