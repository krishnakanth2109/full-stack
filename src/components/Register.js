import React, { useState } from 'react';

// The URL of your Fastify GraphQL endpoint
const GRAPHQL_API_URL = 'http://localhost:4000/graphql';

const Register = () => {
  // State to hold the form data
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    phone: '',
    email: '',
    password: '',
  });

  // State for loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // The GraphQL mutation query
    const registerMutation = `
      mutation RegisterUser($input: RegisterInput!) {
        registerUser(input: $input) {
          id
          fullName
          email
        }
      }
    `;

    // The variables for the mutation, ensuring age is an integer
    const variables = {
      input: {
        ...formData,
        age: parseInt(formData.age, 10),
      },
    };

    try {
      const response = await fetch(GRAPHQL_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: registerMutation,
          variables: variables,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        // Handle GraphQL errors
        throw new Error(result.errors[0].message);
      }

      setSuccess(`Account for ${result.data.registerUser.fullName} created successfully!`);
      // Optionally reset the form
      setFormData({
        fullName: '',
        age: '',
        phone: '',
        email: '',
        password: '',
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Create Your Account</h2>
      <p>Fill out the details below to get started.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            placeholder="25"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="123-456-7890"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="6+ characters"
            required
            minLength="6"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      
      {success && <div className="message success">{success}</div>}
      {error && <div className="message error">{error}</div>}
      
    </div>
  );
};

export default Register;