import React, {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

import {
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import styles from './styles';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [seed, setSeed] = useState(25);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState('default');

  useEffect(() => {
    addUpgrade();
    fetchMyAPI();
    console.log('offset', offset);
    return () => {
      //cleanup
    };
  }, []);

  const fetchMyAPI = async () => {
    try {
      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${seed}`,
      );
      response = await response.json();
      setOffset(offset + 25);
      setPokemonList([...pokemonList, ...response.results]);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoadMore = () => {
    fetchMyAPI();
  };

  const handleRefresh = async () => {
    try {
      let response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${seed}`,
      );
      response = await response.json();
      setOffset(offset + 25);
      setPokemonList([...pokemonList, ...response.results]);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const addUpgrade = () => {
    var upgradedNames = 'Upgraded';
    const pokemonNames = pokemonList.map(item => (upgradedNames += item.name));
    console.log('upgraded', pokemonNames);
  };

  const onPickerSeleceted = value => {
    setStatus(value);
    switch (value) {
      case 'upgrade':
        console.log('upgrade');
        break;
      case 'imposter':
        console.log('imposter');
        break;
      case 'ultimate':
        console.log('ultimate');
        break;
      default:
        handleRefresh();
    }
  };

  const DropDown = () => {
    return (
      <DropDownPicker
        items={[
          {
            label: 'Default',
            value: 'default',
          },
          {
            label: 'Upgrade',
            value: 'upgrade',
          },
          {
            label: 'Imposter',
            value: 'imposter',
          },
          {
            label: 'Ultimate',
            value: 'ultimate',
          },
        ]}
        defaultValue={status}
        containerStyle={{height: 40}}
        style={{
          borderWidth: 2,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          borderColor: 'lightgray',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 0.41,
        }}
        itemStyle={{
          justifyContent: 'flex-start',
        }}
        dropDownStyle={{backgroundColor: 'white'}}
        onChangeItem={item => onPickerSeleceted(item.value)}
      />
    );
  };

  const renderItem = data => (
    <TouchableOpacity style={{backgroundColor: 'skyblue'}}>
      <View style={styles.listItemContainer}>
        <Text style={styles.pokeItemHeader}>{data.item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text>List of pokemons by national dex:</Text>
      <DropDown />
      <View style={{zIndex: -1, marginTop: 150}}>
        {refreshing ? (
          <Text>Fetching pokemon list</Text>
        ) : (
          <FlatList
            data={pokemonList}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              item.name;
            }}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            onEndReached={handleLoadMore}
            onEndThreshold={0}
          />
        )}
      </View>
    </View>
  );
};

export default App;
