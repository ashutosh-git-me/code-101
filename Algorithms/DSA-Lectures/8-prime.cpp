#include<iostream>
using namespace std;
//function signature
bool isPrime(int n){
    for(int i=2; i<n; i++){
        if(n%i==0){
            return 0;
        }
    } 
    return 1;
}

int main()
{
    int n;
    cout<<"Enter a number: ";
    cin>>n;
    
    if (isPrime(n)){
        cout<<endl<<n<<" is a Prime Number.";
    }
    else cout<<endl<<n<<" is NOT a Prime Number.";
}