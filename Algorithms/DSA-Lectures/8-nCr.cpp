#include<iostream>
using namespace std;

int factorial(int n){
    int fact=1;
    for(int i=1; i<=n; i++){
        fact*=i;
    }
    return fact;
}

/*int nCr(int n,int r){
    int ans=1;
    for(int i=1; i<=r; i++){
        ans=(ans*n)/i;
        n-=1;
    }
    return ans;
}*/

int nCr(int n,int r){
    int num=factorial(n);
    int den=factorial(r)*factorial(n-r);
    int ans=num/den;
    return ans;
}

int main()
{
    int n, r;
    cout<<"Enter numbers: ";
    cin>>n>>r;
    int answer=nCr(n,r);
    cout<<endl<<"The answer is:"<<answer;
}