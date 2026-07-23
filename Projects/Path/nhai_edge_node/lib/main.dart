import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:uuid/uuid.dart';
import 'package:geolocator/geolocator.dart';
import 'package:video_player/video_player.dart';
import 'package:http/http.dart' as http;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NHAIRouteEdgeApp());
}

class NHAIRouteEdgeApp extends StatelessWidget {
  const NHAIRouteEdgeApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NHAI Edge Node',
      theme: ThemeData.dark().copyWith(
        primaryColor: Colors.amber,
        scaffoldBackgroundColor: Colors.black,
      ),
      home: const HomeSelectionScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class HomeSelectionScreen extends StatelessWidget {
  const HomeSelectionScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('NHAI Dual-Mode Edge Node'), backgroundColor: Colors.black),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton.icon(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const LiveDriveScreen())),
              icon: const Icon(Icons.drive_eta, size: 28),
              label: const Text("LAUNCH LIVE DRIVE MODE", style: TextStyle(fontSize: 16)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber.shade700,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const VCRPlaybackScreen())),
              icon: const Icon(Icons.videocam, size: 28),
              label: const Text("LAUNCH VCR PLAYBACK", style: TextStyle(fontSize: 16)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blueGrey.shade800,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const GenerativeDemoScreen())),
              icon: const Icon(Icons.auto_awesome, size: 28),
              label: const Text("START DEMO SIMULATION", style: TextStyle(fontSize: 16)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.purple.shade700,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Network Dispatcher implementing the Universal Schema
class TelemetryDispatcher {
  // TASK 1: Target live Ngrok URL
  static const String endpoint = 'https://kilobyte-liver-licking.ngrok-free.dev/api/telemetry';
  // SECURITY: Edge Node authentication token (must match EDGE_SECRET_TOKEN on server)
  static const String edgeToken = 'nhai-edge-secret-2026';

  static Future<void> dispatchUniversalPayload({
    required double lat,
    required double lng,
    required String roadType,
    required String highway,
    String? segment,
    required int speed,
    required String category,
    required String assetType,
    required String severity,
    required String extent,
  }) async {
    final uuid = const Uuid().v4();
    final payload = {
      "event_id": uuid,
      "timestamp": DateTime.now().toUtc().toIso8601String(),
      "location": {
        "lat": lat,
        "lng": lng,
        "road_type": roadType,
        "highway": highway,
        if (segment != null) "segment": segment,
        "speed_kmh": speed
      },
      "asset": {
        "type": assetType,
        "reflectivity_mcd": 0,
        "baseline_mcd": 150
      },
      "incident": {
        "category": category,
        "type": assetType,
        "severity": severity,
        "extent": extent
      },
      "action_flag": "ACTION_REQUIRED"
    };

    debugPrint('🚀 Dispatching Universal Payload: $uuid');
    
    // TASK 2: Robust Network Error Handling
    try {
      final response = await http.post(
        Uri.parse(endpoint),
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
          'x-edge-token': edgeToken,
        },
        body: jsonEncode(payload),
      ).timeout(const Duration(seconds: 4));
      
      if (response.statusCode == 200 || response.statusCode == 201) {
        debugPrint('✅ [$severity] ${assetType.toUpperCase()} reported at $highway');
      } else if (response.statusCode == 404) {
        debugPrint('❌ Network Error: 404 Not Found at Ngrok Tunnel.');
      } else {
        debugPrint('⚠️ Network Error: Server returned ${response.statusCode}');
      }
    } catch (e) {
      if (e.toString().contains('TimeoutException')) {
        debugPrint('🚨 NETWORK DROPPED: Connection Timeout. Tunnel may be down.');
      } else {
        debugPrint('🚨 NETWORK DROPPED. Native exception: $e');
      }
    }
  }
}

/// Live Drive Hardware Integrations
class LiveDriveScreen extends StatefulWidget {
  const LiveDriveScreen({Key? key}) : super(key: key);

  @override
  State<LiveDriveScreen> createState() => _LiveDriveScreenState();
}

class _LiveDriveScreenState extends State<LiveDriveScreen> {
  CameraController? _cameraController;
  bool _isLocating = false;
  
  @override
  void initState() {
    super.initState();
    _initHardware();
  }

  Future<void> _initHardware() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isNotEmpty) {
        _cameraController = CameraController(cameras.first, ResolutionPreset.medium);
        await _cameraController!.initialize();
        if (mounted) setState(() {});
      }
    } catch (e) {
      debugPrint("Camera hardware unavailable");
    }
    
    // Request location permissions
    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      await Geolocator.requestPermission();
    }
  }

  Future<void> _triggerManualPing() async {
    setState(() => _isLocating = true);
    
    try {
      Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.best);
      
      await TelemetryDispatcher.dispatchUniversalPayload(
        lat: position.latitude,
        lng: position.longitude,
        roadType: 'NH',
        highway: 'NH-Live',
        segment: 'Manual Hardware Anchor',
        speed: position.speed.round(),
        category: 'DEGRADATION',
        assetType: 'pothole',
        severity: 'CRITICAL',
        extent: 'Manual Ping: Cluster detected via Hardware Viewfinder',
      );
      
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('✅ Hardware Ping Dispatched'), backgroundColor: Colors.green),
      );
    } catch (e) {
      debugPrint('Ping failed: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🚨 Hardware Ping Failed - Check Permissions'), backgroundColor: Colors.red),
      );
    } finally {
      setState(() => _isLocating = false);
    }
  }

  @override
  void dispose() {
    _cameraController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          if (_cameraController != null && _cameraController!.value.isInitialized)
            CameraPreview(_cameraController!)
          else
            const Center(child: Text("Initializing Camera Hardware...", style: TextStyle(color: Colors.white))),
          Positioned(
            bottom: 40,
            left: 0,
            right: 0,
            child: Center(
              child: FloatingActionButton.extended(
                onPressed: _isLocating ? null : _triggerManualPing,
                backgroundColor: Colors.red.shade700,
                icon: _isLocating ? const CircularProgressIndicator(color: Colors.white) : const Icon(Icons.radar),
                label: const Text("MANUAL HARDWARE PING", style: TextStyle(fontWeight: FontWeight.bold)),
              )
            )
          )
        ],
      ),
    );
  }
}

/// VCR Playback Simulation Interceptor
class VCRPlaybackScreen extends StatefulWidget {
  const VCRPlaybackScreen({Key? key}) : super(key: key);

  @override
  State<VCRPlaybackScreen> createState() => _VCRPlaybackScreenState();
}

class _VCRPlaybackScreenState extends State<VCRPlaybackScreen> {
  VideoPlayerController? _videoController;
  Timer? _vcrTimer;
  int _currentIndex = 0;
  
  // Real coordinates tracing a structural path on NH-46
  final List<Map<String, double>> _nh46Route = [
    {"lat": 23.2599, "lng": 77.4126},
    {"lat": 23.2845, "lng": 77.4201},
    {"lat": 23.3101, "lng": 77.4350},
    {"lat": 23.3412, "lng": 77.4510},
    {"lat": 23.3756, "lng": 77.4690},
  ];

  @override
  void initState() {
    super.initState();
    _initVCR();
  }

  Future<void> _initVCR() async {
    _videoController = VideoPlayerController.asset('assets/dashcam_sample.mp4')
      ..setLooping(true)
      ..initialize().then((_) {
        if (mounted) {
          setState(() {});
          _videoController!.play();
          _startVCRTelemetryClock();
        }
      }).catchError((error) {
        debugPrint("VCR File asset missing, triggering fallback simulation canvas. $error");
        _startVCRTelemetryClock();
      });
  }

  void _startVCRTelemetryClock() {
    _vcrTimer = Timer.periodic(const Duration(seconds: 3), (timer) {
      if (!mounted) return;
      
      final currentPos = _nh46Route[_currentIndex];
      
      TelemetryDispatcher.dispatchUniversalPayload(
        lat: currentPos['lat']!,
        lng: currentPos['lng']!,
        roadType: 'NH',
        highway: 'NH-46 MP',
        segment: 'Simulated VCR Path',
        speed: 65,
        category: 'DEGRADATION',
        assetType: 'pavement_distress',
        severity: 'MODERATE',
        extent: 'Automated VCR Routine: Structural failure 15 sq meters',
      );

      setState(() {
        _currentIndex = (_currentIndex + 1) % _nh46Route.length;
      });
    });
  }

  @override
  void dispose() {
    _vcrTimer?.cancel();
    _videoController?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(title: const Text('VCR Playback Mode'), backgroundColor: Colors.transparent),
      body: Stack(
        fit: StackFit.expand,
        children: [
          if (_videoController != null && _videoController!.value.isInitialized)
            AspectRatio(
              aspectRatio: _videoController!.value.aspectRatio,
              child: VideoPlayer(_videoController!),
            )
          else
            const Center(child: Text("Missing assets/dashcam_sample.mp4 (Running Audio-Less VCR Simulation Trace)", 
              style: TextStyle(color: Colors.white54, fontStyle: FontStyle.italic), textAlign: TextAlign.center)),
              
          Positioned(
            bottom: 40,
            left: 20,
            child: Container(
              padding: const EdgeInsets.all(12),
              color: Colors.black87,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('VCR ROUTINE ACTIVE', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold)),
                  Text('INDEX: $_currentIndex / ${_nh46Route.length - 1}', style: const TextStyle(color: Colors.white)),
                  Text('GPS: ${_nh46Route[_currentIndex]['lat']}, ${_nh46Route[_currentIndex]['lng']}', style: const TextStyle(color: Colors.white, fontFamily: 'monospace')),
                ],
              ),
            ),
          )
        ],
      ),
    );
  }
}

/// GENERATIVE DEMO ENGINE
class MockTelemetryService {
  Timer? _demoTimer;
  final Random _random = Random();
  final Function(Map<String, dynamic>) onPing;

  MockTelemetryService({required this.onPing});

  // TASK 1: Corridor Anchors
  final List<Map<String, dynamic>> _corridors = [
    { "road_type": "EXP", "highway": "Delhi-Mumbai Expressway", "segment": "Surat - Vadodara", "base_lat": 21.1702, "base_lng": 72.8311 },
    { "road_type": "NH", "highway": "NH-44", "segment": "Agra - Gwalior", "base_lat": 27.1767, "base_lng": 78.0081 },
    { "road_type": "SH", "highway": "SH-15", "segment": "Bhopal - Sehore", "base_lat": 23.2599, "base_lng": 77.4126 },
    { "road_type": "MDR", "highway": "MDR-101", "segment": "Indore Ring", "base_lat": 22.7196, "base_lng": 75.8577 }
  ];

  final List<String> _assetTypes = ["PAVEMENT_MARKING", "HAZARD_SIGN", "POTHOLE", "DEBRIS"];

  // TASK 2 & 3: Generation Logic & Dispatch Math
  void dispatchOneShot() {
      final corridor = _corridors[_random.nextInt(_corridors.length)];
      
      final lat = corridor['base_lat'] + (_random.nextDouble() * 0.1 - 0.05);
      final lng = corridor['base_lng'] + (_random.nextDouble() * 0.1 - 0.05);
      
      final asset = _assetTypes[_random.nextInt(_assetTypes.length)];
      String extent = "";
      String severity = "MODERATE";
      String category = "DEGRADATION";

      if (asset == "PAVEMENT_MARKING") {
        final ref = 20 + _random.nextInt(61);
        extent = "Reflectivity: $ref / 150 mcd";
        severity = ref < 40 ? "CRITICAL" : "MODERATE";
      } else if (asset == "POTHOLE") {
        final count = 1 + _random.nextInt(3);
        final dia = 20 + _random.nextInt(41);
        extent = "Cluster of $count, ${dia}cm dia";
        severity = dia > 40 ? "CRITICAL" : "MODERATE";
      } else if (asset == "HAZARD_SIGN") {
        final vis = 20 + _random.nextInt(41);
        extent = "Degraded structural integrity, visibility $vis%";
        severity = vis < 30 ? "CRITICAL" : "MODERATE";
      } else if (asset == "DEBRIS") {
        final vol = 1 + _random.nextInt(5);
        extent = "Volume: $vol cubic meters";
        severity = vol > 3 ? "CRITICAL" : "LOW";
        category = "OBSTRUCTION";
      }

      final payload = {
        'lat': lat,
        'lng': lng,
        'roadType': corridor['road_type'],
        'highway': corridor['highway'],
        'segment': corridor['segment'],
        'speed': 60 + _random.nextInt(40),
        'category': category,
        'assetType': asset.toLowerCase(),
        'severity': severity,
        'extent': extent
      };
      
      onPing(payload);
      
      TelemetryDispatcher.dispatchUniversalPayload(
        lat: payload['lat'],
        lng: payload['lng'],
        roadType: payload['roadType'],
        highway: payload['highway'],
        segment: payload['segment'],
        speed: payload['speed'] as int,
        category: payload['category'],
        assetType: payload['assetType'],
        severity: payload['severity'],
        extent: payload['extent']
      );
  }

  // TASK 2 & 3: Generation Logic & Dispatch Math
  void start() {
    _demoTimer?.cancel();
    _demoTimer = Timer.periodic(const Duration(seconds: 4), (timer) {
      dispatchOneShot();
    });
  }

  void stop() {
    _demoTimer?.cancel();
  }
}

class GenerativeDemoScreen extends StatefulWidget {
  const GenerativeDemoScreen({Key? key}) : super(key: key);
  @override
  State<GenerativeDemoScreen> createState() => _GenerativeDemoScreenState();
}

class _GenerativeDemoScreenState extends State<GenerativeDemoScreen> {
  late MockTelemetryService _service;
  Map<String, dynamic>? _lastPayload;
  bool _isSimulating = false;

  @override
  void initState() {
    super.initState();
    _service = MockTelemetryService(
      onPing: (payload) {
        if (mounted) setState(() => _lastPayload = payload);
      }
    );
  }

  Future<void> _wipeDashboard() async {
    _service.stop();
    setState(() => _isSimulating = false);
    try {
      final response = await http.delete(
        Uri.parse(TelemetryDispatcher.endpoint),
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'x-edge-token': TelemetryDispatcher.edgeToken,
        },
      );
      if (mounted) {
        if (response.statusCode == 200) {
           ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Dashboard Wiped Clean Globally!'), backgroundColor: Colors.red));
           setState(() => _lastPayload = null);
        }
      }
    } catch (e) {
      debugPrint('Wipe Failed: $e');
    }
  }

  @override
  void dispose() {
    _service.stop();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(title: const Text('Generative Demo Controls'), backgroundColor: Colors.purple.shade900),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.tune, color: Colors.purpleAccent, size: 60),
            const SizedBox(height: 24),
            const Text("EDGE NODE EXPERIMENTAL INTERFACE", style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 32),
            
            // MANUAL OVERRIDES
            Wrap(
              runSpacing: 16,
              spacing: 16,
              alignment: WrapAlignment.center,
              children: [
                ElevatedButton.icon(
                  onPressed: () => _service.dispatchOneShot(),
                  icon: const Icon(Icons.flash_on),
                  label: const Text('FIRE MANUAL PING (ONCE)'),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.amber.shade700, foregroundColor: Colors.black, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16)),
                ),
                ElevatedButton.icon(
                  onPressed: () {
                    setState(() => _isSimulating = !_isSimulating);
                    if (_isSimulating) {
                      _service.start();
                    } else {
                      _service.stop();
                    }
                  },
                  icon: Icon(_isSimulating ? Icons.stop : Icons.play_arrow),
                  label: Text(_isSimulating ? 'STOP SIMULATION' : 'START SIMULATION'),
                  style: ElevatedButton.styleFrom(backgroundColor: _isSimulating ? Colors.orange.shade900 : Colors.green.shade700, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16)),
                ),
                ElevatedButton.icon(
                  onPressed: _wipeDashboard,
                  icon: const Icon(Icons.delete_forever),
                  label: const Text('END & WIPE DASHBOARD'),
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.red.shade900, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16)),
                ),
              ],
            ),

            const SizedBox(height: 48),
            if (_lastPayload != null)
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(color: Colors.purple.withOpacity(0.1), borderRadius: BorderRadius.circular(12), border: Border.all(color: Colors.purple.shade700)),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                     const Text("LATEST TRANSMISSION", style: TextStyle(color: Colors.purpleAccent, fontSize: 10, fontWeight: FontWeight.bold, letterSpacing: 2)),
                     const SizedBox(height: 12),
                    Text("📍 ${int.tryParse(_lastPayload!['lat'].toString()) == null ? _lastPayload!['lat'].toStringAsFixed(4) : _lastPayload!['lat']}, ${int.tryParse(_lastPayload!['lng'].toString()) == null ? _lastPayload!['lng'].toStringAsFixed(4) : _lastPayload!['lng']}", style: const TextStyle(color: Colors.white, fontSize: 16)),
                    const SizedBox(height: 4),
                    Text("🛣️ [${_lastPayload!['roadType']}] ${_lastPayload!['highway']} // ${_lastPayload!['segment']}", style: const TextStyle(color: Colors.amber)),
                    const SizedBox(height: 12),
                    Text("🚨 ${_lastPayload!['severity']} - ${_lastPayload!['extent']}", style: TextStyle(color: _lastPayload!['severity'] == 'CRITICAL' ? Colors.redAccent : Colors.white)),
                  ],
                ),
              )
          ],
        ),
      ),
    );
  }
}

