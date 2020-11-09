import React, {Component} from 'react'
import Table from './Table'
import { Navbar, Logo } from 'react-easy-navbar'

class App extends Component {
    state = {
        numbers: [
            {
                number: '(570) 387-0000',
                title: '10All circuits are busy now',
            },
            {
                number: '(409) 724-3137',
                title: '15SIT requires deposit',
            },
            {
                number: '(541) 967-0010',
                title: '1Number Disconnected',
            },
            {
                number: '(207) 775-4321',
                title: '23Time and Temp recording',
            },
            {
                number: '(619) 330-9640',
                title: 'Welcome to inum.',
            },
            {
                number: '(718) 816-9901',
                title: 'North Staten Island	',
            },
            {
                number: '(610) 797-0014',
                title: 'Excuse me, please deposit five cents',
            },
            {
                number: '(330) 572-0999',
                title: 'Continious ring',
            },
            
        ],

    }
        removeNumber = (index) => {
            const {numbers} = this.state

            this.setState({
                numbers: numbers.filter((number, i) => {
                return i !== index
                }),
            })
        }
        textNumber = (index) => {
            //add Wavv messaging functionality
            console.log(index);
        }
        callNumber = (index) => {
            //add Wavv calling functionality
            console.log(index);
        }
  
    
    render() {
  const { numbers } = this.state

  return (
    <div className="container">
        <Navbar
          backgroundColor="black"
          textColor="white"
        >
          <Logo text="WAVV Demo"/>
        </Navbar>
      <Table numberData={numbers} removeNumber={this.removeNumber} textNumber={this.textNumber} callNumber={this.callNumber} />
    </div>
  )
}
}

export default App