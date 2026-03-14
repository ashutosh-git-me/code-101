//Fibonacci Term

#include<iostream>
using namespace std;

int fib(int n){
    int a=0;
    int b=1;
    for(int i=1; i<n; i++){
        int next = a+b;
        a=b;
        b=next;
       
    }
    return a;

}

int main()
{
    int n;
    cout<<"Enter the term: ";
    cin>>n;
    cout<<n<<"Term is: "<<fib(n);
    return 0;
}