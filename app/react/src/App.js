import React, {Component} from 'react';
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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: '',
      last: '',
      email: '',
      checkboxes: [],
      connected: false,
      colorSelected: ''
    };
    this.handleColor = this.handleColor.bind(this);
  }
  
  handleColor (color) {
    this.setState({colorSelected: color})
  }

  render() {
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
                  hue: 120,
                  brightness: 1,
                  saturation: 1,
                }}
                allowAlpha
                onChange={this.handleColor}
              />
            Color: {this.state.selectedColor}
            </SettingToggle>
            <SettingToggle>
              <ChoiceList
                title="Dimensions"
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
                selected={['100,300']}
              />
            </SettingToggle>
          </Layout.AnnotatedSection>

          <Layout.AnnotatedSection
            title="Form"
            description="A sample form using Polaris components."
          >
            <Card sectioned>
              <FormLayout>
                <FormLayout.Group>
                  <TextField
                    value={this.state.first}
                    label="First Name"
                    placeholder="Tom"
                    onChange={this.valueUpdater('first')}
                  />
                  <TextField
                    value={this.state.last}
                    label="Last Name"
                    placeholder="Ford"
                    onChange={this.valueUpdater('last')}
                  />
                </FormLayout.Group>

                <TextField
                  value={this.state.email}
                  label="Email"
                  placeholder="example@email.com"
                  onChange={this.valueUpdater('email')}
                />

                <TextField
                  multiline
                  label="How did you hear about us?"
                  placeholder="Website, ads, email, etc."
                  value={this.state.autoGrow}
                  onChange={this.valueUpdater('autoGrow')}
                />

                <ChoiceList
                  allowMultiple
                  choices={choiceListItems}
                  selected={this.state.checkboxes}
                  onChange={this.valueUpdater('checkboxes')}
                />

                <Button primary>Submit</Button>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>

          <Layout.Section>
            <FooterHelp>For more details on Polaris, visit our <Link url="https://polaris.shopify.com">styleguide</Link>.</FooterHelp>
          </Layout.Section>

        </Layout>
      </Page>
    );
  }

  valueUpdater(field) {
    return (value) => this.setState({[field]: value});
  }
  toggleConnection() {
    this.setState(({connected}) => ({connected: !connected}));
  }

  connectAccountMarkup() {
    return (
      <Layout.AnnotatedSection
        title="Account"
        description="Connect your account to your Shopify store."
      >
        <AccountConnection
          action={{
            content: 'Connect',
            onAction: this.toggleConnection.bind(this, this.state),
          }}
          details="No account connected"
          termsOfService={<p>By clicking Connect, you are accepting Sample’s <Link url="https://polaris.shopify.com">Terms and Conditions</Link>, including a commission rate of 15% on sales.</p>}
        />
      </Layout.AnnotatedSection>
    );
  }

  disconnectAccountMarkup() {
    return (
      <Layout.AnnotatedSection
          title="Account"
          description="Disconnect your account from your Shopify store."
        >
        <AccountConnection
          connected
          action={{
            content: 'Disconnect',
            onAction: this.toggleConnection.bind(this, this.state),
          }}
          accountName="Tom Ford"
          title={<Link url="http://google.com">Tom Ford</Link>}
          details="Account id: d587647ae4"
        />
      </Layout.AnnotatedSection>
    );
  }

  renderAccount() {
    return this.state.connected
      ? this.disconnectAccountMarkup()
      : this.connectAccountMarkup();
  }
}

export default App;
