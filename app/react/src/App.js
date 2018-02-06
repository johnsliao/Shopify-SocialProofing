import React, {Component} from 'react';
import Settings from './Settings.js';
import Install from './Install.js';
import { Tabs, Page } from '@shopify/polaris';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {selectedTab: 0};
  }

  render() {
    return (
      <Page>
        <Tabs
          fitted
          selected={this.state.selectedTab}
          onSelect={(tabIndex) => {this.setState({ selectedTab: tabIndex})}}
          tabs={[
            {
              id: 'Settings',
              content: 'Settings',
              accessibilityLabel: 'Settings Page',
            },
            {
              id: 'Install-Help',
              content: 'Install help',
            }
          ]}
          >
          {
            ((selectedTab) => {
             switch (selectedTab) {
               case 0:
                 return (
                   <Settings></Settings>
                 );
               case 1:
                 return(
                   <Install></Install>
                 );
               }
           })(this.state.selectedTab)
         }
        </Tabs>
      </Page>
    )
  }
}

export default App;
