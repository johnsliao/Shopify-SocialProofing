import React, {Component} from 'react';
import convert from 'color-convert';
import {
  Layout,
  Page,
  FooterHelp,
  Card,
  Link,
  Button,
  FormLayout,
  TextField,
  AccountConnection,
  ChoiceList,
  SettingToggle,
  ColorPicker
} from '@shopify/polaris';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      color: {    
        hue: 83.28358208955224,
        saturation: 0.30625,
        brightness: 0.48750000000000004,
        alpha: 1
      },
      size: '100,300',
      socialSetting: 'latest',
      socialTime: '1d'
    };
    this.handleColor = this.handleColor.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleSocial = this.handleSocial.bind(this);
    this.handleTime = this.handleTime.bind(this);
  }
  
  handleColor (color) {
    this.setState({color})
  }
  
  handleSize (size) {
    this.setState({size})
  }
  
  handleSocial (social) {
    this.setState({socialSetting: social})
  }
  
  handleTime (time) {
    this.setState({socialTime: time})
  }

  render() {
    const { hue, saturation, brightness } = this.state.color;
    const rgbColor = convert.hsl.rgb(hue, saturation, brightness); 
    const colorBoxStyle = {
      width: '80px',
      height: '80px',
      margin: '5px',
      float: 'right',
      border: '1px solid',
      backgroundColor: `rgb(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]})`
    }
    
    return (
      <Page
        title="Setup"
      >
        <Layout>
          <Layout.AnnotatedSection
            title="Style"
            description="Customize the size and appearance of the modal"
          >
            <SettingToggle>
              <ColorPicker
                color={{
                  hue: this.state.color.hue,
                  brightness: this.state.color.brightness,
                  saturation: this.state.color.saturation,
                  alpha: this.state.color.alpha
                }}
                allowAlpha
                onChange={this.handleColor}
              />
              <div style={colorBoxStyle}>
                This is the color box.
              </div>
            </SettingToggle>
            <SettingToggle>
              <ChoiceList
                title="Dimensions in pixels"
                choices={[
                  {
                    label: '100x300',
                    value: '100,300'
                  },
                  {
                    label: '150x300',
                    value: '150,300'
                  },
                  {
                    label: '300x100',
                    value: '300,100'
                  },
                ]}
                selected={this.state.size}
                onChange={this.handleSize}
              />
            </SettingToggle>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title="Social Proof Settings"
            description="Display data as # of customers who have added this product, viewed the product,
            or display the last customer who purchased it."
          >
            <Card sectioned>
              <FormLayout>
                <FormLayout.Group>
                  <ChoiceList
                    title="Social Proof Settings (Default: display latest customer)"
                    choices={[
                      {
                        label: '# of customers who have purchased this product',
                        value: 'purchase'
                      },
                      {
                        label: '# of customers who have viewed this product',
                        value: 'view'
                      },
                      {
                        label: 'Display latest customer who purchased this product',
                        value: 'latest'
                      }
                    ]}
                    selected={this.state.socialSetting}
                    onChange={this.handleSocial}
                  />
                  <ChoiceList
                    title="Look Back Duration (Default 1 day)"
                    choices={[
                      {
                        label: 'Last 6 hours',
                        value: '6h'
                      },
                      {
                        label: 'Last 12 hours',
                        value: '12h'
                      },
                      {
                        label: 'Last Day',
                        value: '1d'
                      },
                      {
                        label: 'Last 3 Days',
                        value: '3d'
                      },
                      {
                        label: 'Last 7 Days',
                        value: '7d'
                      },
                    ]}
                    selected={this.state.socialTime}
                    onChange={this.handleTime}
                  />
                </FormLayout.Group>
                <Button primary>Submit & Save</Button>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>

          <Layout.Section>
            <FooterHelp>For help visit <Link url="https://www.google.com/search?ei=jLUIWvK0JojimAHg-KY4&q=help&oq=help&gs_l=psy-ab.3..0i67k1l2j0j0i67k1j0j0i67k1j0l4.1185.1507.0.1749.4.4.0.0.0.0.194.194.0j1.1.0....0...1.1.64.psy-ab..3.1.194....0.HDVDjU-AKiQ">styleguide</Link>.</FooterHelp>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Settings;
