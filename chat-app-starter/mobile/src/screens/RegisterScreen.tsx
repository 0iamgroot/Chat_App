import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
      />

      <View style={styles.inputRow}>
        <TextInput
          key={showPass ? "text" : "password"}
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPass}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="newPassword"
        />
        <TouchableOpacity onPress={() => setShowPass((p) => !p)} style={styles.eyeBtn}>
          <Text style={{ color: "#3b82f6" }}>{showPass ? "🙈" : "👁️"}</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#888"
        value={confirm}
        onChangeText={setConfirm}
        secureTextEntry={!showPass}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
      />

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
        Already have an account? Login
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#0d1117" },
  title: { color: "#fff", fontSize: 24, marginBottom: 20, textAlign: "center" },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: {
    backgroundColor: "#161b22",
    color: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  eyeBtn: { marginLeft: 8, padding: 8 },
  btn: {
    backgroundColor: "#3b82f6",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
  link: { color: "#3b82f6", marginTop: 16, textAlign: "center" },
});
