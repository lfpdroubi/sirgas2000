  // helper functions
  function gestaoPraiaStatus(feature){
    switch (feature.properties.gest_praia){
    	case 1 : return 'Sim' ;
      case 0 : return 'Não' ;
      	break;
    }
  }
  
  function getAreaColor(feature){
    console.log(feature);
  	switch (feature.properties.gest_praia){
    	case 1 : return 'OrangeRed' ;
      case 0 : return 'LightYellow' ;
      	break;
    }
  }
  
  function areaStyle(feature){
  	return {
    	fillColor: getAreaColor(feature),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5
    };
  }
