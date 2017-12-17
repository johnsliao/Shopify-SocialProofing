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
      socialSetting: '',
      socialTime: '',
      socialScope: '',
      location: '',
      settingSaved: false
    };
    this.appUrl = context.appUrl;
    this.shop = context.shop;
    this.handleSocialSetting = this.handleSocialSetting.bind(this);
    this.handleTime = this.handleTime.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSocialScope = this.handleSocialScope.bind(this);
    this.handleLocation = this.handleLocation.bind(this);
    this.showSaveStatus = this.showSaveStatus.bind(this);
    this.convertDaysToTimestampText = this.convertDaysToTimestampText.bind(this);
  }

  componentWillMount () {
    fetch(this.appUrl + '/api/store_settings/' + this.shop)
    .then((response) => {
        return response.json();
    }).then((data) => {
        console.log(data);
        var f_time = this.convertSocialTimeFromHours(data.look_back);
        this.setState({socialTime: [f_time], location: [data.location], socialSetting: [data.social_setting], socialScope: [data.social_scope]});
        return data;
    }).catch((e) => {
        console.log('error' + e);
    });
  }

  showSaveStatus () {
    this.setState({settingSaved: true});
    console.log("this.state ", this.state.settingSaved);
  }

  handleSocialSetting (socialSetting) {
    this.setState({socialSetting: socialSetting})
  }

  handleTime (time) {
    this.setState({socialTime: time})
  }

  handleSocialScope (socialScope) {
    this.setState({socialScope: socialScope})
  }

  handleLocation (location) {
    this.setState({location: location})
  }

  convertSocialTimeFromHours(time) {
    // Receive hours and convert to corresponding choice list value, e.g. 24 -> '1d'
    let f_time;
    switch (time) {
          case 1:
            f_time = "1h";
            break;
          case 12:
            f_time = "12h";
            break;
          case 24:
            f_time = "1d";
            break;
          case 168:
            f_time = "7d";
            break;
          default:
            f_time = "1d";
     }
     return f_time
  }

   convertSocialTimeToHours(time) {
    // Receive choice list value and convert to hours, e.g. '1d' -> 24
    let f_time;
    switch (time[0]) {
          case "1h":
            f_time = 1;
            break;
          case "12h":
            f_time = 12;
            break;
          case "1d":
            f_time = 24;
            break;
          case "7d":
            f_time = 168;
            break;
          default:
            f_time = 24;
     }
     return f_time
  }
  
  convertDaysToTimestampText(days) {
    // Returns days to timestamp text and floors it and units
    var units = "";
    var convertedTime = "";
    if (days * 24 < 1) {
      convertedTime = days*24*60;
      units = "minutes";
    } else if (days < 1) {
      convertedTime = days*24;
      units = "hours";
    } else {
      convertedTime = days;
      units = "days";
    }
    convertedTime = Math.floor(convertedTime);

    if (convertedTime == 1) {
      units = units.replace("s", "");
    }

    return {
      convertedTime: convertedTime,
      units: units
    };
  }

  handleClick () {
    let postBodyStr = '';
    postBodyStr += 'look_back=';
    postBodyStr += this.convertSocialTimeToHours(this.state.socialTime);
    postBodyStr += '&';

    postBodyStr += 'social_setting=';
    postBodyStr += this.state.socialSetting;
    postBodyStr += '&';

    postBodyStr += 'social_scope=';
    postBodyStr += this.state.socialScope;
    postBodyStr += '&';

    postBodyStr += 'location=';
    postBodyStr += this.state.location;
    postBodyStr += '&';

    console.log(postBodyStr);

    fetch(this.appUrl + '/api/store_settings/' + this.shop, {
        method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: postBodyStr
        }).then((resp) => {
          console.log("Successful post")
          this.showSaveStatus()
        })
   }
   
   handlePreviewText () {
     const { socialSetting, socialTime, socialScope } = this.state;
     //socialSetting --       label: 'Display latest customer to purchase product', value: 'latest'
                          //  label: 'Display number of customers who have purchased product', value: 'purchase'
     
     let textObj = {
       socialSettingText: "",
       productName: "",
       socialTime: ""
     }
     
     if (socialSetting === 'latest') {
       textObj.socialSettingText = "Victoria Y. purchased a"
       textObj.productName = "Trendy Nautica Dress"
     } else if (socialSetting === 'purchase') {
       testObj.socialSettingText = "23 people purchased"
       textObj.productName = "Trendy Nautica Dress"
     }
     const time = this.convertSocialTimeToHours(socialTime)
     textObj.socialTime = `${time} `
     return textObj
   }

  render() {
    const modalPreviewStyle = {
      width: "350px",
      height: "70px",
      display: "block",
      backgroundColor: "white",
      boxShadow: "0 0 5px #888"
    }
    const imageContainer = {
      width: "35%",
      position: "relative",
      margin: "0 5px 0 0"
    }
    const imageStyle = {
      width: "auto",
      border: "0",
      maxHeight: "70px"
    }
    const textObj = this.handlePreviewText();
    return (
      <Page
        title="Setup"
      >
        <Layout>
          <Layout.AnnotatedSection
            title="Modal Preview"
            description="This is how your modal will display."
          >
            <Card sectioned>
              Preview of how your modal will look.
              <div style={modalPreviewStyle}>
                This is the preview box.
                <div style={imageContainer}>
                  <img style={imageStyle} src="http://via.placeholder.com/70x70"/>
                    <span>{textObj.socialSettingText}</span>
                    <span>{textObj.productName}</span>
                    <span>{textObj.socialTime}</span>
                </div>
              </div>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Style"
            description="Customize the appearance and location of the modal"
          >
            <SettingToggle>
              <ChoiceList
                title="Location"
                choices={[
                  {
                    label: 'Lower left',
                    value: 'lower-left'
                  },
                  {
                    label: 'Lower right',
                    value: 'lower-right'
                  }
                ]}
                selected={this.state.location}
                onChange={this.handleLocation}
              />
            </SettingToggle>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title="Social Proof Settings"
            description="Display data as number of customers who have added this product, viewed the product,
            or display the last customer who purchased it."
          >
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <ChoiceList
                  title="Social Proof Setting"
                  choices={[
                    {
                      label: 'Display latest customer to purchase product',
                      value: 'latest'
                    },
                    {
                      label: 'Display number of customers who have purchased product',
                      value: 'purchase'
                    }
                  ]}
                  selected={this.state.socialSetting}
                  onChange={this.handleSocialSetting}
                />
                <ChoiceList
                  title="Look Back Setting"
                  choices={[
                    {
                      label: 'Last hour',
                      value: '1h'
                    },
                    {
                      label: 'Last 12 hours',
                      value: '12h'
                    },
                    {
                      label: 'Last day',
                      value: '1d'
                    },
                    {
                      label: '7 days (Recently)',
                      value: '7d'
                    }
                  ]}
                  selected={this.state.socialTime}
                  onChange={this.handleTime}
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
          <Card sectioned>
            <FormLayout>
              <FormLayout.Group>
                <ChoiceList
                  title="Scope Setting"
                  choices={[
                    {
                      label: 'Same Product',
                      value: 'product'
                    },
                    {
                      label: 'Vendor',
                      value: 'vendor'
                    },
                    {
                      label: 'Tags',
                      value: 'tags'
                    },
                    {
                      label: 'Collections',
                      value: 'collections'
                    },
                    {
                      label: 'Product Type',
                      value: 'product_type'
                    },
                    {
                      label: 'Any (randomly selected)',
                      value: 'any'
                    },
                  ]}
                  selected={this.state.socialScope}
                  onChange={this.handleSocialScope}
                />
              </FormLayout.Group>

            </FormLayout>
          </Card>
          </Layout.AnnotatedSection>

          <Layout.Section>
          <Button onClick={this.handleClick} primary>Submit & Save</Button> {this.state.settingSaved && <div>Thank you! Your settings have been updated.</div>}
          </Layout.Section>

          <Layout.Section>
            <FooterHelp>Suggestions or Feedback? Email us at Michael.John.Devs@gmail.com</FooterHelp>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }
}

export default Settings;
