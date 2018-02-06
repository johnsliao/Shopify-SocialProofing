
class Install extends Component {
  constructor(props) {
    super(props);
  }
  
  render () {  
    return (
	     <div>
    		<h1>Social Proof Samurai - Manual Installation Guide</h1>
    		  <p>Follow these steps to manually add the Social Proof Samurai script to your product pages.</p>
    		<hr>
    		<h4>Before you start this guide:</h4>
    		<p>Make sure you have the Social Proof Samurai application installed.</p>
    		<a href="https://apps.shopify.com/social-proof-samurai">Click here to install the Social Proof Samurai app</a>
    		<hr>
    		<p/>
    		<h4>Step 1</h4>
    		<p> Click "Online Store" under "Sales Channels" on the left hand side of your Shopify store page </p>
    		    <img src="https://i.imgur.com/zoDRAiz.png" alt="step1" style={{width:'1100px'}}></a>
    		<p/>

    		<h4>Step 2</h4>
    		<p> Click Actions -> Edit code </p>
    		    <img src="https://i.imgur.com/zmvcisq.png" alt="step2" style={{width:'1100px'}}></a>
    		<p/>

    		<h4>Step 3</h4>
    		<p> Under Layout, click "theme.liquid" </p>
    		    <img src="https://i.imgur.com/Tq57LCB.png" alt="step2" style={{width:'1100px'}}></a>
    		<p/>

    		<h4>Step 4</h4>
    		<p> Code will appear on the right. Scroll to the bottom and add the following between &lt;/body&gt; and &lt;/html&gt; tags: </p>
    		   <code>&lt;script src="https://socialproof-samurai.herokuapp.com/static/js/initializeModal.js"&gt;&lt;/script&gt;</code>
    		     <img src="https://i.imgur.com/qLju9Ju.png" alt="step2" style={{width:'1100px'}}></a>
    		<p/>

    		<h4>Step 5</h4>
    		<p>Click Save</p>
    		    <img src="https://i.imgur.com/nz9gLyl.png" alt="step2" style={{width:'1100px'}}></a>
    		<p/>

    		<h4>Step 6</h4>
    		<p> The pop up should appear on your product pages as shown here:</p>
    		    <img src="https://i.imgur.com/pQjXe7x.png" alt="step2" style={{width:'1100px'}}></a>
    		<p/>

    		<hr>
    		<h2>Frequently Asked Questions (FAQ)</h2>
    		<b>What is the procedure to install this app?</b>
    		<p>Click the installation button labelled "Get". After approving the permissions that the app requires, you will be redirected to the Social Proof Samurai settings page. We set the default social proof settings for you, but feel free to edit them to best suit your needs.</p>

    		<b>When will my social proof data get refreshed?</b>
    		<p>We scan your orders database every few hours in order to make sure the social proof data on your products is as up to date as possible.</p>

    		<b>No pop up is showing on my product pages</b>
    		<p>The furthest Social Proof Samurai will check orders is within the last 7 days. If a product does not have an order within that time, then no pop up will appear.</p>
    		<p>If you had an order within the last 7 days or within your specific look back period and its not showing up, then your theme files may be preventing it from popping up. Please follow the manual installation instructions <a href="https://socialproof-samurai.herokuapp.com/installation_guide">here</a>.</p>

    		<b>Will this affect my theme files?</b>
    		<p>No. This app does not make any changes to your theme/liquid files.</p>

    		<b>How can I contact you for support?</b>
    		<p>Please contact us at socialproof.samurai@gmail.com. We will get back to you within 24-48 hours.</p>

    		<b> How can I uninstall your app? </b>
    		<p> Please visit your store’s application page to uninstall Social Proof Samurai.</p>

    		<br>
    		<hr>
    		<span className="text-muted"><b>Still having trouble?</b> Email us at <a href="mailto:socialproof.samurai@gmail.com?Subject=Help%20request" target="_top">socialproof.samurai@gmail.com</a> for support.</span>
  	   </div>
       )
  }
}

export default Install;
