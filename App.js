import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import Constants from 'expo-constants';
import KeyHandler, { KEYPRESS } from 'react-key-handler';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default class App extends React.Component {
  INVENTORY_SIZE = 10;
  STORE_SIZE = 5;
  STORE = ['Annie*', 'Taric*', 'Amumu*', 'Fiora*', 'Diana*'];
  STORE_WIDTH = 200;
  
  componentWillMount(){
    this.setState({
      // inventory: this.initInventory(this.INVENTORY_SIZE),
      store: this.initStore(this.STORE_SIZE),
    })
  }

  render() {
    const {inventory, store} = this.state;
    return (
      <View>
        <View style={{flex:1, flexDirection:'row'}}>
          {this.generateInventoryUnits()}
        </View>
        <View style={{flex:1, flexDirection:'row'}}>
          {store.length === 0 ? this.initStore(this.STORE_SIZE) : store.map((unit, index) => {
            return this.generateStoreUnit(index, unit);
          })}
        </View>
        <Button
          title='Refresh Store'
          onClick= {() => this.setState({store: this.initStore()})}
          style={{width: this.STORE_WIDTH*5}}
        />
        <KeyHandler
          keyEventName={KEYPRESS}
          keyValue='d'
          onKeyHandle={() => this.setState({store: this.initStore()})}
        />
      </View>
    );
  }

  state = {
    inventory: [],
    store: [],
  };

  //generates random number between 0 and max (non inclusive of max)
  randomNumber = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  combine = (inventory) => {
    let canCombine = true;
    while(canCombine){
      const unitMap = {};
      canCombine = false;
      inventory.forEach((currUnit) => {
        if(!unitMap[currUnit]){
          unitMap[currUnit] = 0;
        }
        unitMap[currUnit] = unitMap[currUnit]+1;
        }
      );
      Object.keys(unitMap).map((unitKey) => {
        if(unitMap[unitKey] === 3){
          canCombine = true;
          var indices = inventory.map((e, i) => e === unitKey ? i : '').filter(String).sort();
          inventory[indices[0]] = inventory[indices[0]] + '*';
          inventory.splice(indices[1],1);
          inventory.splice(indices[2]-1,1);
        }
      });
    }
    return inventory;
  }

  generateStoreUnit = (x, title) => {
    return <Button
      title={title} 
      buttonStyle={{
        backgroundColor:'blue',
        borderColor: 'red',
        borderWidth: 1,
        width: this.STORE_WIDTH,
      }}
      onPress={(event) => {
        const { store } = this.state;
        let { inventory } = this.state;
        if(inventory.length === this.INVENTORY_SIZE){
          inventory.push(title);
          inventory = this.combine(inventory);
          if(inventory.length > this.INVENTORY_SIZE){
            inventory.splice(inventory.length - 1);
          } else {
            store[x] = ' ';
          }
        } else if(store && store[x] && inventory.length < this.INVENTORY_SIZE){
          inventory.push(title);
          store[x] = ' ';
          inventory = this.combine(inventory);
        }
        this.setState({inventory, store});
      }}
      disabled={title===' '}
      />
  }

  generateInventoryUnits = () => {
    const { inventory } = this.state;
    const inventoryButtons = [];
    for(let i = 0; i < this.INVENTORY_SIZE; i++) {
      const button = <Button
      buttonStyle={{
        backgroundColor:'green',
        borderColor: 'red',
        borderWidth: 1,
        width: this.STORE_WIDTH/2,
        height: 50,
      }}
      onPress={() => {
        if(inventory && inventory[i]){
          inventory.splice(i,1);
         this.setState({inventory});
        }
      }}
      title={ i < inventory.length ? inventory[i] : ' '}
      />;
      inventoryButtons.push(button);
    }
    return inventoryButtons;
  }

  initStore = () => {
    const store = [];
    for(let x = 0; x < this.STORE_SIZE; x += 1){
      const title = this.STORE[this.randomNumber(5)];
      // const unit = this.generateStoreUnit(x, title);
      store.push(title);
    }
    return store;
  }

  initInventory = () => {
    const inventory = [];
    for(let x = 0; x < this.INVENTORY_SIZE; x += 1){
      inventory.push(' ');
    }
    return inventory;
  }

  handleKeyPress = (event) => {
    if(event.key === 'd'){
      this.setState({store: this.initStore()});
    }
  }
}
