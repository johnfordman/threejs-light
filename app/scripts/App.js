import Stats from '../libs/stats.min'
import OrbitControls from 'imports-loader?THREE=three!exports-loader?THREE.OrbitControls!three/examples/js/controls/OrbitControls' // eslint-disable-line import/no-webpack-loader-syntax
import vertShader from '../shaders/shader.vert'
import fragShader from '../shaders/shader.frag'
import GeometryUtils from '../libs/GeometryUtils' 
import utils from '../helpers/utils';

export default class App {

    constructor() {
        this.stats =  new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );

        this.container = document.querySelector( '#main' );
    	document.body.appendChild( this.container );
        this.geometry = ''
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.z =70;
        this.camera.lookAt(new THREE.Vector3(0,0,0))
        this.ambientLight = new THREE.AmbientLight(0xffffff);

        this.c1 = 0xF93030
        this.c2 = 0xffe12f
        this.c3 = 0x8f85ff
        this.c4 = 0x8f85ff
        this.light1 =  new THREE.PointLight( this.c1, 6, 100 );
        this.light2 =  new THREE.PointLight( this.c2, 1, 20 );
        this.light3 =  new THREE.PointLight( this.c3, 5, 200 );
        this.lightArr = []

        this.scene = new THREE.Scene();
        this.mouse = new THREE.Vector2();
        this.direction_mouse    = new THREE.Vector3(0, 0, 0);
        this.cameraPosition_mouse = new THREE.Vector3(0, 0, 0)
        this.cameraEasing_mouse = 2
        this.nbLight = 100
        this.colorLight = [0xE6DBD9,0xffffff,0xFFFFF3]

        this.init()
        this.initEvent();

        this.controls = new OrbitControls(this.camera,this.container)

    	window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.onWindowResize();

    }


    init(){
       // this.scene.background = new THREE.Color( 0xffffff );
   var sphere = new THREE.SphereGeometry( 0.2, 16, 8 );



       // this.light1.position.set( 10, 0, 7 );
       // this.light2.position.set( 2, 7, 8 );

       // this.light3.position.set( 9, 0, 8 );

        this.scene.add(this.ambientLight)

        // this.light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: this.c1 } ) ) );
        // this.scene.add( this.light1 );


        // this.light2.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: this.c2 } ) ) );
        // this.scene.add( this.light2 );

        //  this.light3.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: this.c3 } ) ) );
        // this.scene.add( this.light3 );


        this.geometry = new THREE.SphereGeometry( 5, 7, 7 );
        this.material = new THREE.MeshPhongMaterial({ color: 0x000000,flatShading:true,shininess: 200 });

        this.sphere = new THREE.Mesh( this.geometry, this.material );



    for ( var i = 0; i < this.nbLight; i ++ )   {
            var randomColor = this.colorLight[Math.floor(Math.random()*this.colorLight.length)];
             var light =  new THREE.PointLight( randomColor, .8, 25 );
             light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: randomColor } ) ) );

            this.alpha = Math.random()*(Math.PI)
            this.phi = Math.random()*(Math.PI*2)

            var x = 20* Math.cos(this.alpha)*Math.sin(this.phi)
             var y = 20* Math.sin(this.alpha)*Math.sin(this.phi)
            var z =  20*Math.cos(this.phi)
            
            light.position.set( x, y, z );

            this.lightArr.push(light)
            this.scene.add(light)
    
    }   



        //var dlight = new THREE.DirectionalLight( 0xff0000, 0.05 );
      //  dlight.position.set( 0.5, 1, 0 ).normalize();
        //this.scene.add( dlight );
        this.scene.add( this.sphere );

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.container.appendChild( this.renderer.domElement );
        this.renderer.animate( this.render.bind(this) );

    }

    render() {
        var time = performance.now() * 0.005;

        this.stats.update();
     //   this.sphere.rotation.x = time 
        this.direction_mouse.subVectors(this.mouse, this.cameraPosition_mouse)
        this.direction_mouse.multiplyScalar(.06)
        this.cameraPosition_mouse.addVectors(this.cameraPosition_mouse, this.direction_mouse)
        this.camera.position.x =  this.cameraPosition_mouse.x * this.cameraEasing_mouse * -1
        this.camera.position.y =  this.cameraPosition_mouse.y * this.cameraEasing_mouse * -1
        this.sphere.rotation.y = this.cameraPosition_mouse.x * this.cameraEasing_mouse* -1
        this.sphere.rotation.x = this.cameraPosition_mouse.y * this.cameraEasing_mouse
       // for ( var i = 0; i < this.lightArr.length; i ++ )   {
            var randomSpeed = utils.map(Math.random(), 0, 1, .2,.4);
            this.lightArr[1].position.x =  Math.sin( randomSpeed ) ;
            this.lightArr[1].position.z =  Math.cos( randomSpeed );
        //}
      //  var d =7;
        // this.light1.position.x = Math.sin( time * 0.3 ) * d;
        // this.light1.position.y = Math.cos( time * 0.3 ) * d

        // this.light2.position.x = Math.sin( time * 0.5 ) * d;
        // this.light2.position.y = Math.cos( time * 0.5 ) * d;

        // this.light3.position.x = Math.sin( time * 0.2 ) * d;
        // this.light3.position.z = Math.cos( time * 0.2 ) * d;

        this.renderer.render( this.scene, this.camera );
    }

    onWindowResize() {
    	this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    initEvent(){
        window.addEventListener('mousemove', (event) =>{
            event.preventDefault()
            this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
            this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        },false);
    }

}
